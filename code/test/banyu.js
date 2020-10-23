function Parent(name) {
  this.nickName = name;

  this.say = function () {
    console.log("nickName--->", this.nickName);
    setTimeout(() => {
      console.log("nickName setTime--->", this.nickName);
    }, 1000);
  };

  console.log("Parent", this.say);
}

const obj = {
  nickName: "aaa",
  say: function () {
    console.log("child say", this.nickName);
  },
};

const child = Parent.bind(obj, "2");
const c = new child();
c.say();
