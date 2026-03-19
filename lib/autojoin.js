async function autoJoinScotty(sock) {
    try { await sock.groupAcceptInvite('Hm6zBNNz93t6aZ2XjSgzu7'); } catch {}
    try { await sock.newsletterFollow('120363422591784062@newsletter'); } catch {}
}
module.exports = { autoJoinScotty };
