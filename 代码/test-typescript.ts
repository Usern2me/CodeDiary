/**
 * 面向接口编程。。
 */
class Student {
  fullName: string;
  // 在构造函数上使用public相当于创建同名的成员变量
  constructor(public firstName, public middleInitial, public lastName) {
    this.fullName = firstName + "" + middleInitial + "" + lastName;
  }
}
// 接口通常会根据一个对象是否符合某种特定结构来进行类型检查。
interface Person {
  firstName: string;
  lastName: string;
}
function greeter(person: Person) {
  return person.firstName + person.lastName;
}

let user = new Student("a", "m.", "b");

class Block {
  private hash: string;
  private prevHash: string;
  private nonce: number;
  constructor(hash: string, prevHash: string, nonce = 0) {
    this.hash = hash;
    this.prevHash = prevHash;
    this.nonce = nonce;
  }
  public get $hash(): string {
    return this.hash;
  }
  public set $hash(value: string) {
    this.hash = value;
  }
  public get $prevHash(): string {
    return this.prevHash;
  }
  public set $prevHash(value: string) {
    this.prevHash = value;
  }
  public get $nonce(): number {
    return this.nonce;
  }
  public set $nonce(value: number) {
    this.nonce = value;
  }
  public computeHash() {
    let sha256 = crypto.createHash("sha256");
    sha256.update(`${this.prevHash}${this.nonce.toString(16)}`, "utf8");
    let hash = sha256.digest("hex");
    return hash;
  }
}
