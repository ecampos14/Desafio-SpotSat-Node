function authenticate(req, res) {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Formato da requisição inválido!' });
    }
  
    if (email === 'admin@exemplo.com.br' && password === 'abcd1234') {
      return res.status(200).json({ message: 'Autenticado com sucesso!' });
    }
    
    return res.status(401).json({ message: 'Falha ao autenticar!' });
  }
  
  module.exports = {
    authenticate,
  };
  