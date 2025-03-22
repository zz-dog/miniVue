export const Teleport = {
  __isTeleport: true,
};

export const isTeleport = (value) => {
  return !!value?.__isTeleport;
};
