const MM_TO_PX = 96 / 25.4;
const EXPECTED_WIDTH = 210 * MM_TO_PX;
const EXPECTED_HEIGHT = 297 * MM_TO_PX;
const WRITING_SELECTOR = '.writing-zone,.drawing-zone,.drawing-box,.writing-lines,.worksheet-lines,.lines,.line,.write-line,.tall,.answer-box,.evidence-box';
const MIN_INTENTIONAL_WRITING_RATIO = 0.35;

export async function measurePack(page, record) {
  return page.evaluate(({ recordId, expectedWidth, expectedHeight, writingSelector, minWritingRatio }) => {
    const pages = [...document.querySelectorAll('.print-page')];
    return {
      lessonId: recordId,
      pageCount: pages.length,
      pages: pages.map((element, index) => {
        const rect = element.getBoundingClientRect();
        const content = element.querySelector('.print-page__content');
        const header = element.querySelector('.print-page__header');
        const footer = element.querySelector('.print-page__footer');
        const contentRect = content?.getBoundingClientRect();
        const headerRect = header?.getBoundingClientRect();
        const footerRect = footer?.getBoundingClientRect();
        const blocks = [...(content?.querySelectorAll('.activity-block') || [])].map(block => {
          const blockRect = block.getBoundingClientRect();
          return {
            id: block.dataset.blockId || '',
            major: block.classList.contains('activity-block--major'),
            minor: block.classList.contains('activity-block--minor'),
            top: blockRect.top,
            bottom: blockRect.bottom,
            left: blockRect.left,
            right: blockRect.right,
            width: blockRect.width,
            height: blockRect.height
          };
        });
        const writingRegions = [...(content?.querySelectorAll(writingSelector) || [])]
          .map(region => {
            const regionRect = region.getBoundingClientRect();
            return {
              className: region.className || '',
              top: regionRect.top,
              bottom: regionRect.bottom,
              left: regionRect.left,
              right: regionRect.right,
              width: regionRect.width,
              height: regionRect.height
            };
          })
          .filter(region => region.width > 1 && region.height > 1);
        const majorCount = blocks.filter(block => block.major).length;
        const minorCount = blocks.filter(block => block.minor).length;
        const usedTop = blocks.length ? Math.min(...blocks.map(block => block.top)) : 0;
        const usedBottom = blocks.length ? Math.max(...blocks.map(block => block.bottom)) : 0;
        const occupancy = contentRect && blocks.length ? (usedBottom - usedTop) / contentRect.height : 0;
        const intentionalSpace = element.dataset.intentionalSpace === 'true';
        const microSequence = element.dataset.microSequence === 'true';
        const hasWritingRegion = writingRegions.length > 0;
        const largestWritingRegionHeight = writingRegions.length ? Math.max(...writingRegions.map(region => region.height)) : 0;
        const largestWritingRegionRatio = contentRect?.height ? largestWritingRegionHeight / contentRect.height : 0;
        const errors = [];
        const pageNumber = Number(element.dataset.page);
        const declaredPageCount = Number(element.dataset.pageCount);

        if (Math.abs(rect.width - expectedWidth) > 4) errors.push(`width ${rect.width.toFixed(2)}px`);
        if (Math.abs(rect.height - expectedHeight) > 4) errors.push(`height ${rect.height.toFixed(2)}px`);
        if (pageNumber !== index + 1) errors.push(`data-page ${pageNumber} expected ${index + 1}`);
        if (declaredPageCount !== pages.length) errors.push(`data-page-count ${declaredPageCount} expected ${pages.length}`);
        if (!contentRect || !headerRect || !footerRect) errors.push('missing header/content/footer geometry');
        if (header && header.scrollHeight > header.clientHeight + 2) errors.push(`header overflow ${header.scrollHeight - header.clientHeight}px`);
        if (footer && footer.scrollHeight > footer.clientHeight + 2) errors.push(`footer overflow ${footer.scrollHeight - footer.clientHeight}px`);

        if (contentRect) {
          const overflow = Math.max(0, content.scrollHeight - content.clientHeight);
          if (overflow > 2) errors.push(`content overflow ${overflow}px`);
          for (const block of blocks) {
            if (block.top < contentRect.top - 1 || block.bottom > contentRect.bottom + 1 ||
                block.left < contentRect.left - 1 || block.right > contentRect.right + 1) {
              errors.push(`block ${block.id || '(missing id)'} outside content rectangle`);
            }
            if (footerRect && block.bottom > footerRect.top - 1) errors.push(`block ${block.id || '(missing id)'} intersects footer`);
          }
          for (const region of writingRegions) {
            if (region.left < contentRect.left - 1 || region.right > contentRect.right + 1 ||
                region.top < contentRect.top - 1 || region.bottom > contentRect.bottom + 1) {
              errors.push(`writing region outside content rectangle`);
            }
          }
        }

        if (!blocks.length) errors.push('empty page');
        if (majorCount > 1) errors.push(`${majorCount} major activities`);
        if (!microSequence && blocks.length > 2) errors.push(`${blocks.length} activity blocks`);
        if (microSequence && majorCount > 0) errors.push('micro sequence contains major activity');
        if (occupancy < 0.35 && !intentionalSpace) errors.push(`low occupancy ${(occupancy * 100).toFixed(1)}%`);
        if (intentionalSpace && !hasWritingRegion) errors.push('intentional-space page lacks writing/drawing region');
        if (intentionalSpace && occupancy < 0.35 && largestWritingRegionRatio < minWritingRatio) {
          errors.push(`intentional writing region uses ${(largestWritingRegionRatio * 100).toFixed(1)}%, expected at least ${(minWritingRatio * 100).toFixed(0)}% of content height`);
        }

        return {
          pageNumber,
          declaredPageCount,
          width: rect.width,
          height: rect.height,
          contentHeight: contentRect?.height || 0,
          scrollHeight: content?.scrollHeight || 0,
          occupancy,
          intentionalSpace,
          microSequence,
          majorCount,
          minorCount,
          hasWritingRegion,
          writingRegionCount: writingRegions.length,
          largestWritingRegionHeight,
          largestWritingRegionRatio,
          writingRegions,
          blocks,
          errors
        };
      })
    };
  }, {
    recordId: record.id,
    expectedWidth: EXPECTED_WIDTH,
    expectedHeight: EXPECTED_HEIGHT,
    writingSelector: WRITING_SELECTOR,
    minWritingRatio: MIN_INTENTIONAL_WRITING_RATIO
  });
}

export function assertLayoutReport(report) {
  const failures = [];
  if (!report.pageCount) failures.push(`${report.lessonId}: no print pages`);
  for (const page of report.pages) {
    for (const error of page.errors) failures.push(`${report.lessonId} page ${page.pageNumber}: ${error}`);
  }
  if (failures.length) {
    const error = new Error(failures.join('\n'));
    error.layoutReport = report;
    throw error;
  }
  return report;
}

export const A4_PIXELS = { width: EXPECTED_WIDTH, height: EXPECTED_HEIGHT };
export const A4_WRITING_CONTRACT = { selector: WRITING_SELECTOR, minimumRatio: MIN_INTENTIONAL_WRITING_RATIO };
