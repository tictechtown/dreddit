// replace ##<text> by ## <text>

interface MarkdownToken {
  type: 'inline' | 'block' | 'text' | 'heading_open' | 'heading_close';
  content: string;
  tag: string;
  markup: string;
  children: MarkdownToken[];
}

interface MarkdownState {
  tokens: MarkdownToken[];
}

function headingRuler(state: MarkdownState) {
  const blockTokens = state.tokens;

  for (let i = 0; i < blockTokens.length; i++) {
    if (blockTokens[i].type !== 'inline') {
      continue;
    }
    for (let j = 0; j < blockTokens[i].children.length; j++) {
      const inlineToken = blockTokens[i].children[j];
      if (inlineToken.type !== 'text') {
        continue;
      }
      if (inlineToken.content.startsWith('#')) {
        let shouldFixBlock = 0;

        if (inlineToken.content.startsWith('######')) {
          if (inlineToken.content[6] !== ' ') {
            inlineToken.content = inlineToken.content.replace('######', '');
            shouldFixBlock = 6;
          }
        } else if (inlineToken.content.startsWith('#####')) {
          if (inlineToken.content[5] !== ' ') {
            inlineToken.content = inlineToken.content.replace('#####', '');
            shouldFixBlock = 5;
          }
        } else if (inlineToken.content.startsWith('####')) {
          if (inlineToken.content[4] !== ' ') {
            inlineToken.content = inlineToken.content.replace('####', '');
            shouldFixBlock = 4;
          }
        } else if (inlineToken.content.startsWith('###')) {
          if (inlineToken.content[3] !== ' ') {
            inlineToken.content = inlineToken.content.replace('###', '');
            shouldFixBlock = 3;
          }
        } else if (inlineToken.content.startsWith('##')) {
          if (inlineToken.content[2] !== ' ') {
            inlineToken.content = inlineToken.content.replace('##', '');
            shouldFixBlock = 2;
          }
        } else {
          if (
            inlineToken.content[1] !== ' ' &&
            Number.isNaN(parseInt(inlineToken.content[1], 10))
          ) {
            inlineToken.content = inlineToken.content.replace('#', '');
            shouldFixBlock = 1;
          }
        }
        if (shouldFixBlock > 0) {
          blockTokens[i - 1].type = 'heading_open';
          blockTokens[i + 1].type = 'heading_close';
          blockTokens[i - 1].tag = `h${shouldFixBlock}`;
          blockTokens[i + 1].tag = `h${shouldFixBlock}`;
          blockTokens[i - 1].markup = '######'.slice(0, shouldFixBlock);
          blockTokens[i + 1].markup = '######'.slice(0, shouldFixBlock);
        }
      }
    }
  }
}

const markdownRedditHeadingPlugin = (md: any) => {
  md.core.ruler.push('redditheading', headingRuler);
};

export default markdownRedditHeadingPlugin;
