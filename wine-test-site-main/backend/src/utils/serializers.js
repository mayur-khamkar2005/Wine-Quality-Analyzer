const serializeId = (value) => value?.toString?.() || String(value);

export const serializeUser = (user) => ({
  id: serializeId(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  lastLoginAt: user.lastLoginAt || null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const serializeWineRecord = (record) => {
  const serializedUser =
    record.user && typeof record.user === 'object' && record.user._id
      ? serializeUser(record.user)
      : record.user
        ? { id: serializeId(record.user) }
        : null;

  return {
    id: serializeId(record._id),
    user: serializedUser,
    inputs: record.inputs,
    prediction: record.prediction,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};
