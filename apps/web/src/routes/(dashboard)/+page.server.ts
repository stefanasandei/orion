export const load = async (event) => {
    return {
        user: event.locals.user,
        metadata: event.locals.userMetadata
    };
};
