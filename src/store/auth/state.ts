function state() {
  return {
    isAuthenticated: false,
    isReady: false,
  };
}

export type AuthStateInterface = ReturnType<typeof state>;

export default state;
