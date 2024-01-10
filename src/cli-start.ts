/* eslint-disable unicorn/no-process-exit */
import { execSync } from 'node:child_process';

import { bold, green, red } from 'kolorist';
import { rainbow } from 'ungradient';
import { cancel, confirm, intro, isCancel, select, spinner, text } from 'unprompts';

const defaultConfig = {
  chore: {
    title: '🏡 Chores',
    hint: 'Build process or auxiliary tool changes',
  },
  feat: {
    title: '🚀 Features',
    hint: 'A new feature',
  },
  fix: {
    title: '🐛 Fixes',
    hint: 'A bug fix',
  },
  style: {
    title: '💄 Style',
    hint: 'Markup, white-space, formatting, missing semi-colons...',
  },
  ci: {
    title: '🤖 CI',
    hint: 'CI related changes',
  },
  docs: {
    title: '📖 Documentation',
    hint: 'Documentation only changes',
  },
  refactor: {
    title: '🔨 Refactor',
    hint: 'A code change that neither fixes a bug nor adds a feature',
  },
  revert: {
    title: '⏪ Reverts',
    hint: 'Reverts a previous commit',
  },
  test: {
    title: '🧪 Tests',
    hint: 'Adding missing tests or correcting existing tests',
  },
  types: {
    title: '🏷  Types',
    hint: 'Changes types (typescript, flow...)',
  },
  examples: {
    title: '📚 Examples',
    hint: 'Examples folder changes',
  },
  release: {
    title: '🚢 Release',
    hint: 'Release related changes',
  },
  core: {
    title: '🔥 Core',
    hint: 'Core related changes',
  },
  perf: {
    title: '🏎  Performance',
    hint: 'A code change that improves performance',
  },
  i18n: {
    title: '🌐 I18n',
    hint: 'Internationalization related changes',
  },
  a11y: {
    title: '♿️ Accessibility',
    hint: 'Accessibility related changes',
  },
  report: {
    title: '📊 Report',
    hint: 'Report related changes',
  },
  cli: {
    title: '🖥  CLI',
    hint: 'CLI related changes',
  },
  audits: {
    title: '🔍 Audits',
    hint: 'Audits related changes',
  },
  misc: {
    title: '🎫 Misc',
    hint: 'Misc related changes',
  },
  wip: {
    title: '🚧 WIP',
    hint: 'Work in progress',
  },
  build: {
    title: '📦 Build',
    hint: 'Build related changes',
  },
  dx: {
    title: '🛠  DX',
    hint: 'Developer Experience changes',
  },
  workflow: {
    title: '🔧 Workflow',
    hint: 'Workflow related changes',
  },
  deps: {
    title: '📦 Dependencies',
    hint: 'Dependencies related changes',
  },
  improve: {
    title: '👌 Improvements',
    hint: 'Improvements related changes',
  },
  security: {
    title: '🔒 Security',
    hint: 'Security related changes',
  },
  deprecated: {
    title: '🗑  Deprecated',
    hint: 'Deprecated related changes',
  },
  other: {
    title: '🧹 Other',
    hint: 'Other related changes',
  },
} as any;

const VERSION = '0.0.2';

export const startCli = async () => {
  intro(bold(rainbow(`Commit lint v${VERSION}`)));

  const type = await select({
    message: 'Commit type',
    options: Object.keys(defaultConfig).map((it: string) => ({
      label: `${defaultConfig[it].title}: ${defaultConfig[it].hint}`,
      value: it,
    })),
  });

  if (isCancel(type)) {
    cancel('Commit lint cancelled');
    return process.exit(0);
  }

  const scope = (await text({
    message: 'Commit scope (optional)',
    placeholder: '',
    defaultValue: '',
  })) as string;

  if (isCancel(scope)) {
    cancel('Commit lint cancelled');
    return process.exit(0);
  }

  const description = (await text({
    message: 'Commit description (optional)',
    placeholder: 'Update something',
    defaultValue: 'Update',
  })) as string;

  if (isCancel(description)) {
    cancel('Commit lint cancelled');
    return process.exit(0);
  }

  const isBreakingChange = await confirm({
    message: 'BREADKING CHANGES 💥',
    initialValue: false,
  });

  if (isCancel(isBreakingChange)) {
    cancel('Commit lint cancelled');
    return process.exit(0);
  }

  const s = spinner();

  const msg = `${type}${scope ? `(${scope})` : ''}${isBreakingChange ? '!' : ''}: ${description}`;

  s.start('Committing...');

  try {
    execSync(`git commit -m "${msg}"`);
    s.stop(green('Commit done!'));
  } catch {
    cancel('No file git add or changed to commit');
    s.stop(red('Commit error!'));

    return process.exit(0);
  }

  return process.exit(0);
};
