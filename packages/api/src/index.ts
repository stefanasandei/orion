import { createCallerFactory, createRouter } from './context';
import { contentRouter } from './routers/content';
import { projectRouter } from './routers/project';
import { tagRouter } from './routers/tag';
import { userRouter } from './routers/user';
import { workspaceRouter } from './routers/workspace';

export const appRouter = createRouter({
  user: userRouter,
  workspace: workspaceRouter,
  project: projectRouter,
  tag: tagRouter,
  content: contentRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

export { createTRPCContext } from './context';
export type { Context } from './context';
