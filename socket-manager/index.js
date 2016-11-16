module.exports = {
  setManager: function (io){
    this.io = io;
  },
  getManager: function (){
    return this.io;
  }
};
