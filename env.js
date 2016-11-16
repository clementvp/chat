function verify(a){
  if (a === undefined || a === null){
    console.log("Pease provide a password");
    process.exit();
  }
  return a;
}

module.exports = {
  passServer: verify(process.argv[2]),
  clients: {}
}
