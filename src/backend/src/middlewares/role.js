/**
 * Middleware de autorización por roles.
 * Uso: router.get('/algo', auth, role('admin'), handler)
 *      router.get('/algo', auth, role('admin', 'veterinario'), handler)
 */
module.exports = function role(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!allowedRoles || allowedRoles.length === 0) {
      return res.status(500).json({ error: 'Roles permitidos no configurados' });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    return next();
  };
};
