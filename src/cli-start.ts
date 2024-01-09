/* eslint-disable unicorn/no-process-exit */
import { execSync } from 'node:child_process';

import { bold } from 'kolorist';
import { rainbow } from 'ungradient';
import { cancel, confirm, intro, isCancel, select, text } from 'unprompts';

const defaultConfig = {
  chore: { title: '🏡 Chores' },
  feat: { title: '🚀 Features' },
  fix: { title: '🐛 Fixes' },
  style: { title: '💄 Style' },
  ci: { title: '🤖 CI' },
  docs: { title: '📖 Documentation' },
  refactor: { title: '🔨 Refactor' },
  revert: { title: '⏪ Reverts' },
  test: { title: '🧪 Tests' },
  types: { title: '🏷 Types' },
  examples: { title: '📚 Examples' },
  release: { title: '🚢 Release' },
  core: { title: '🔥 Core' },
  perf: { title: '🏎 Performance' },
  i18n: { title: '🌐 I18n' },
  a11y: { title: '♿️ Accessibility' },
  report: { title: '📊 Report' },
  cli: { title: '🖥 CLI' },
  audits: { title: '🔍 Audits' },
  misc: { title: '🎫 Misc' },
  wip: { title: '🚧 WIP' },
  build: { title: '📦 Build' },
  dx: { title: '🛠 DX' },
  workflow: { title: '🔧 Workflow' },
  deps: { title: '📦 Dependencies' },
  improve: { title: '👌 Improvements' },
  security: { title: '🔒 Security' },
  deprecated: { title: '🗑 Deprecated' },
  other: { title: '🧹 Other' },
} as any;

export const startCli = async () => {
  intro(bold(rainbow('Commit lint')));

  const type = await select({
    message: 'Select commit type',
    options: Object.keys(defaultConfig).map((it: string) => ({
      label: defaultConfig[it].title,
      value: it,
    })),
  });

  if (isCancel(type)) {
    cancel('Commit lint cancelled');
    return process.exit(0);
  }

  const scope = (await text({
    message: 'Type commit scope (optional)',
    placeholder: '',
    defaultValue: '',
  })) as string;

  if (isCancel(scope)) {
    cancel('Commit lint cancelled');
    return process.exit(0);
  }

  const description = (await text({
    message: 'Type commit description (optional)',
    placeholder: 'Update abcxyz',
    defaultValue: 'Update',
  })) as string;

  if (isCancel(description)) {
    cancel('Commit lint cancelled');
    return process.exit(0);
  }

  const isBreakingChange = await confirm({
    message: '💥 Breaking changes',
    initialValue: false,
  });

  if (isCancel(isBreakingChange)) {
    cancel('Commit lint cancelled');
    return process.exit(0);
  }

  const msg = `${type}${scope ? `(${scope})` : ''}${isBreakingChange ? '!' : ''}: ${description}`;

  try {
    execSync(`git commit -m "${msg}"`);
  } catch {
    cancel('No file git add or changed to commit');

    return process.exit(0);
  }

  return process.exit(0);
};
