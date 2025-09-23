/**
 * Inspired by markdown-it-regexp
 */

export const rendererRule = (tokens: any, idx: any, options: any) => {
  return options.replace(tokens[idx].content);
};

export const coreRuler = (state: any, silent: boolean, options: any) => {
  for (let i = 0; i < state.tokens.length; i++) {
    if (state.tokens[i].type !== 'inline') {
      continue;
    }
    if (silent) {
      continue;
    }
    let tokens = state.tokens[i].children;
    for (let j = tokens.length - 1; j >= 0; j--) {
      const token = tokens[j];
      if (token.type === 'text' && options.regex.test(token.content)) {
        // don't insert any tokens in silent mode

        const newTokens = token.content
          .split(options.regex)
          .map((item: any, index: any) => ({
            type: index % 2 === 0 ? 'text' : options.name,
            content: item,
          }))
          .filter((item: any) => item.content.length > 0)
          .map((item: any) => {
            const newToken = new state.Token(item.type, '', 0);
            newToken.content = item.content;
            return newToken;
          });
        state.tokens[i].children = tokens = [
          ...tokens.slice(0, j),
          ...newTokens,
          ...tokens.slice(j + 1),
        ];
      }
    }
  }
};

const regexPlugin = (md: any, options: any) => {
  md.renderer.rules[options.name] = (tokens: any, idx: any) => {
    return rendererRule(tokens, idx, options);
  };

  md.core.ruler.push(options.name, (state: any, silent: boolean) => {
    coreRuler(state, silent, options);
  });
};

export default regexPlugin;
