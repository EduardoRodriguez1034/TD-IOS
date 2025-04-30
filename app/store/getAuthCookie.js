export const getAuthCookie = async () => {
    try {
        const cookieString = document.cookie;
        const cookies = cookieString.split(';').reduce((acc, cookie) => {
          const [name, value] = cookie.trim().split('=');
          acc[name] = value;
          return acc;
        }, {});
        return cookies.token;
    } catch (err) {
      console.error('Error al obtener cookies:', err);
      throw err;
    }
  };