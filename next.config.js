module.exports = {
  async redirects() {
    return [
      {
        source: '/((?!blank).*)',
        destination: '/blank',
        permanent: false,
      },
    ];
  },
};
