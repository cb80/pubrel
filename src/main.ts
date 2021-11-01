import fs from 'fs';
import { getTagFromRef } from './getTagFromRef';
import * as core from '@actions/core';
import * as github from '@actions/github';

const { owner } = github.context.repo;
const { repo } = github.context.repo;

const run = async function (): Promise<void> {
  try {
    core.info('Parsing the ref');
    const ref: string = core.getInput('ref');
    let tag;

    try {
      tag = getTagFromRef(ref);
    } catch (ex: any) {
      core.debug(ex.message);
      core.info('Skipping publish');

      return;
    }
    core.info(`Tag is: ${tag}`);
    core.info('Setting up Octokit');
    const token: string = core.getInput('token');
    const octokit = github.getOctokit(token);

    core.info(`Searching release by tag: ${tag}`);
    let dat1;

    try {
      dat1 = await octokit.rest.repos.getReleaseByTag({ owner, repo, tag });
    } catch (ex: any) {
      // No release found is a good thing
      core.debug(ex.message);
    }

    core.debug(JSON.stringify(dat1));

    if (dat1 !== undefined) {
      const replace: string = core.getInput('replace');

      if (replace === 'true' || replace === tag) {
        core.info(`Deleting release id ${dat1.data.id}`);
        const { data: resp } = await octokit.rest.repos.deleteRelease({
          owner,
          repo,
          release_id: dat1.data.id
        });

        core.debug(resp);
      } else {
        throw new Error(
          'Set replace to true or a tag name if you want me to replace an existing release.'
        );
      }
    }

    core.info('Creating the new release as draft');
    const { data: rel2 } = await octokit.rest.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
      name: tag,
      draft: true
    });

    core.debug(JSON.stringify(rel2));

    const argFiles: string = core.getInput('files');
    const files: string[] = argFiles
      .split('\n')
      .map((line): string => line.trim())
      .filter((line): boolean => line.length > 0);

    core.info('Uploading files');
    for (const file of files) {
      const name = file.split('/').pop()!;

      core.info(`Uploading ${file}`);
      const { data: resp } = await octokit.rest.repos.uploadReleaseAsset({
        owner,
        repo,
        release_id: rel2.id,
        url: rel2.upload_url,
        data: fs.readFileSync(file) as unknown as string,
        headers: {
          'content-type': 'application/octet-stream',
          'content-length': fs.statSync(file).size
        },
        name
      });

      core.debug(JSON.stringify(resp));
    }

    core.info('Publishing the new release');
    const { data: rel3 } = await octokit.rest.repos.updateRelease({
      owner,
      repo,
      release_id: rel2.id,
      draft: false
    });

    core.debug(JSON.stringify(rel3));
  } catch (ex: any) {
    core.setFailed(ex.message);
  }
};

run();
