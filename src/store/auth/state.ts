function state() {
  return {
    isAuthenticated: false,
    isReady: false,
    uid: '',
  };
}

export type AuthStateInterface = ReturnType<typeof state>;

export default state;
