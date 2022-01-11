const colors = {
  white: '#FFFFFF',
  white_dark: '#dbdbdb',
  black: '#2c3e50',
  kin: '#6f41e8',
  kin_light: 'rgb(104, 85, 151)',
  kin_dark: '#4927a0',
  background: '#efedf5',
  red: 'red',
  green: 'green',
};

const breakpoints = {
  mobileBreakpoint: '770px',
  smallScreenBreakpoint: '1440px',
};

const kinLinks = {
  docs: [
    {
      name: 'Kin Docs',
      link: 'https://developer.kin.org',
    },
  ],

  sdkRepos: [],
  devPortal: [
    { name: 'Kin Developer Portal', link: 'https://portal.kin.org/' },
  ],
  serverRepos: [
    {
      name: 'Node',
      link: 'https://github.com/kinecosystem/node-sdk-demo-server',
    },
  ],
  setupClient: [
    {
      name: 'Node',
      link:
        'https://github.com/kinecosystem/node-sdk-demo-server/blob/master/src/index.ts#L46-L53',
    },
  ],
  createAccount: [
    {
      name: 'Node',
      link:
        'https://github.com/kinecosystem/node-sdk-demo-server/blob/master/src/index.ts#L60-L78',
    },
  ],
  getBalance: [
    {
      name: 'Node',
      link:
        'https://github.com/kinecosystem/node-sdk-demo-server/blob/master/src/index.ts#L85-L109',
    },
  ],
  requestAirdrop: [
    {
      name: 'Node',
      link:
        'https://github.com/kinecosystem/node-sdk-demo-server/blob/master/src/index.ts#L116-L139',
    },
  ],
  makePayment: [
    {
      name: 'Node',
      link:
        'https://github.com/kinecosystem/node-sdk-demo-server/blob/master/src/index.ts#L146-L187',
    },
  ],
};

export { colors, breakpoints, kinLinks };