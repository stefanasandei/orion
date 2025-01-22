import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { GithubOAuthProvider } from '@repo/auth';

export const githubOAuth = new GithubOAuthProvider(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);
