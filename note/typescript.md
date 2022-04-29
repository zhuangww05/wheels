## Typescript

#### # 基础
静态类型系统是替代Javascript原本动态系统的解决方案.

#### # ts.config
strictNullChecks: 在使用可能为null或者undefined之前进行检验.
noImplicitAny: 隐式推断为any时进行报错.

#### # type和interface区别
type可以做类型别名, interface不可以.
type通过交集(&)进行扩展, interface通过继承(extends)进行扩展.
type无法修改已经定义过字段对应的数据类型, interface可以修改.

#### # 可辩别联合
```javascript
type Square {
    kind: "square";
    sideLength: number;
}

type Circle {
    kind: "circle";
    radius: number
}

type Shape = Square | Circle

function getArea(shape: Shape) {
    if(shape.kind === "circle") return Math.PI * shape.radius ** 2
    else return shape.sideLength ** 2
}

````

#### # never穷尽检查
```javascript
type Square {
    kind: "square";
    sideLength: number;
}

type Circle {
    kind: "circle";
    radius: number
}

type Triangle {
    kind: "triangle";
    sideLength: number;
}

type Shape = Cricle | Square | Triangle

function getArea(shape: Shape) {
    switch(shape.kind) {
        case "square":
            return Math.PI() * shape.kind ** 2
            break
        case "circle":
            return sideLength ** 2
            break
        default:
            const _exhaustiveCheck: never = shape;
            return _exhaustiveCheck;
    }
}
// getArea执行到default时，shape类型收缩至Triangle，所以无法赋值给新变量; 这样可确保getArea函数内已对所有可能类型进行相应处理
``` 

#### # 调用签名
```javascript
type DescribableFunction = {
    description: string;
    (someArg: number): boolean;
}

function doSomething(fn: DescribableFunction) {
    console.log(fn.description + " returned " + fn(6) )
}
```

#### # 构造签名
```javascript
type SomeConstructor = {
    new (s: string): SomeObject;
}

type CallOrConstruct {
    new (s: string): Date;
    (n?: number): number;
}
```

#### # 函数类型 ?
void
> javascript中一个函数不返回任何值时会隐式返回undefined, 在typescript中void和undefined中不一样.

object
> 这个特殊的类型object可以表示任何不是原始类型的值(string, number, bigint, boolean, symbol, null, undefined).
object不同于空对象类型{}, 也不同于全局类型Object.

unknown
> unknown可以表示任何值, 相对于any更安全, 因为unknown类型的值做任何事情都是不合法的.
```javascript
// 描述一个函数返回一个不知道什么类型的值
function safeParse(s: string): unknown {
    return JSON.parse(s)
}
const obj = safeParse(someRandomString)
```

never
> never表示一个值不会再被观察到.
作为一个返回类型时, 它表示这个函数会丢一个异常或者程序终止执行, 在编辑器进行类型推断的时候, 确定在联合类型中已经没有可能是其中的类型的时候, never类型也会出现.

#### # 剩余参数 ?
```javascript
const args = [8, 5] as const
const angle = Math.atan2(..args)
```

#### # 参数解构
```javascript
function sum({a, b, c}: {a: number, b: number: c: number}) {
    return a + b + c
}
```

#### # 函数的可赋值性
```javascript
type voidFunc = () => void;
 
const f1: voidFunc = () => {
  return true;
};

const f2: voidFunc = () => true;

const f3: voidFunc = function () {
  return true;
};

// 特殊例子, 当一个函数字面量定义返回一个void类型, 函数是一定不能返回任何东西的
function f2(): void {
  // @ts-expect-error
  return true;
}

const f3 = function (): void {
  // @ts-expect-error
  return true;
};

```

#### # readonly

typescript在检查两个类型是否兼容的时候, 并不会考虑两个类型里的属性是否是readonly, 意味着readonly的值是可以通过别名修改的.

```javascript
interface Person {
	name: string;
	age: number
}

interface ReadonlyPerson {
	readonly name: string;
	readonly age: number
}

let writeablePerson: Person = {
	name: "zhuangww05",
	age: 23
}

let readonlyPerson: ReadonlyPerson = writeablePerson

console.log(readonlyPerson.age) // 23
writeablePerson.age++
console.log(readonlyPerson.age) // 24
```

#### # 索引签名

一个索引签名的属性必须是string或者是number, 但数字索引的返回类型一定要是字符索引返回类型的子类型.

```javascript
[index: number]: string
```

这是因为当使用一个数字进行索引的时候, javascript实际上把它转成一个字符串.

```javascript
interface Interface {
	[x: number]: string;
	[x: string]: string;
}

interface Animal {
  name: string;
}
 
interface Dog extends Animal {
  breed: string;
}
 
// Error: indexing with a numeric string might get you a completely separate type of Animal!
interface NotOkay {
  [x: number]: Animal;
  // 'number' index type 'Animal' is not assignable to 'string' index type 'Dog'.
  [x: string]: Dog;
}
```

强制要求所有的属性要匹配索引签名的返回类型

```javascript
interface Interface1 {
	[index: number]: string;
	age: string;
	// name与索引签名返回类型不匹配, 报错
	name: number;
}

// 联合类型则可以接受
interface Interface2 {
	[index: number]: number | string;
	name: string;
	age: number;
}
```

#### # 接口继承与交叉类型的区别

接口类型继承相同索引会报错

```javascript
interface Colorful {
	color: string;
}

interface ColorSub extends Colorful {
	color: number;
}
```

交叉类型会兼容, 类型会取交集, 若没有则是never

```javascript
interface Colorful {
	color: string;
}

type ColorSub = Colorful & {
	color: number;
}
```

#### # 泛型对象类型

```javascript
interface Box<Type> {
	content: Type;
}

function setContent<Type>(box: Box<Type>, newContent: Type) {
	box.content = newContent
}
```

#### # 元组类型

可解构

可选元素必须在最后

使用剩余元素语法, 但必须是array/tuple类型

```javascript
type StringNumberBooleanPair = [string, number,...boolean[] , number?]
```

元组类型是可以设置readonly的.

在大部分的代码中, 元组只是被创建, 使用完后也不会被修改, 所以尽可能的将元组设置为readonly是一个好习惯.

```javascript
// 相当于readonly [3, 4]
let point = [3, 4] as const

function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}
 
// 报错, 因为distanceFromOrigin函数的参数希望是一个可变元组
distanceFromOrigin(point);
```

#### # keyof操作符

会返回该对象属性名组成的一个字符串或者数字字面量的联合

```javascript
type Arrayish = {
	[k: string]: boolean
}

type A = keyof Arrayish
// type A = string | number
```

```javascript
function getProperty<T, K extends keyof T>(o: T, k: K){
	return o[k]
}

const x = { a: 1, b: 2, c: 3, d: 4 }
getProperty(x, "a")
// Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
getProperty(x, "m")
```

数字字面量

```javascript
const NumericObject = {
	[1]: "one",
	[2]: "two",
	[3]: "three",
}

type N = keyof typeof NumericObject
// typeof NumbericObject = {
//	1: string;
//	2: string;
//	3: string
//}
// type N = 1 | 2 | 3
```

Symbol

```javascript
const sym1 = Symbol()
const sym2 = Symbol()
const sym3 = Symbol()

const symbolToNumberMap = {
	[sym1]: 1,
	[sym2]: 2,
	[sym3]: 3
}

type S = keyof typeof symbolToNumberMap 
// type S = sym1 | sym2 | sym3
```

```javascript
function useKey<T, K extends keyof T>(o: T, k: K) {
	const name: string = k
	// Type 'string | number | symbol' is not assignable to type 'string'.
}

//如果是只想使用字符串类型的属性名可以这样
function useKey<T, K extends Extract<keyof T, string>>(o: T, k: K) {
	const name: string = k
}

//或者
function useKey<T, K extends keyof T>(o: T, k: K) {
	const name: string | number | symbol = k
}
```

类和接口

```javascript
class Person {
	name: "zhuangww05"
}
typeof result = keyof Person

// typeof result = "name"
```

```javascript
interface Person {
	name: string
}
typeof result = keyof Person

// typeof result = "name"
```

#### # typeof

```javascript
type Predicate = (x: unknow) => boolean
type P = ReturnType<Predicate>

// type P = boolean

function f() {
	return {
		x: 10,
		y: 20
	}
}
type F = ReturnType<typeof f>

//type F = {
//	x: number;
//	y: number;
//}
```

#### # 索引访问类型

```javascript
type Person = {
	name: string;
	age: number;
	alive: boolean;
}

type P1 = Person["name"]
// string

type P2 = Person["name" | "age"]
// string | number

type P3 = Person[keyof Person]
// string | number | boolean

const key = "age"
type Age = Person[key]

// Type 'key' cannot be used as an index type.
```

```javascript
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

type M = typeof MyArray[number]

// type M = {
//    name: string;
//    age: number;
// }
```

作为索引的只能是类型, 这意味这不能使用const创建一个变量引用

```javascript
const App = ["Taobao", "Tmall", "Alipay"] as const
type app = typeof App[number]

// type app = "Taobao" | "Tmall" | "Alipay"

```

#### # 条件类型
```javascript
interface Animal = {
    name: number;
}

interface Cat extends Animal {
    age: number;
}

type T = Cat extends Animal ? number : string

// type T = number
```
```javascript
interface IdLabel {
    id: number;
}
interface NameLabel {
    name: string;
}

// 复杂重载
function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}

// 简化重载
type NameOrId<T extends number | string> = T extends IdLabel ? number : string
function createLabel<T extends nume | string>(idOrName: T): NameOrId<T> {}
const a = createLabel("typescript");
// let a: NameLabel

const b = createLabel(2.8);
// let b: IdLabel

const c = createLabel(Math.random() ? "hello" : 42);
// let c: NameLabel | IdLabel
```

#### # 条件类型约束
```javascript
interface Message {
    message: string;
}
type M<T> = T extends { message: unknow } ? T["message"] : never
type E = M<Message>

// type E = strubg 
```
获取数组元素的类型，当传入的不是数组，则直接返回传入的类型
```javascript
type Flatten<T> = T extends any[] ? T[number] : T
type A = {
  age: number;
  name: string;
};

type Str = Flatten<A[]>;

// type Str = { age: number, name: string }
```
#### # 条件类型分发
```javascript
type M<T> = T extends any ? T[] : boolean

type A = M<number | string>

// type A = number[] | string[]
```
```javascript
type M<T> = [T] extends [any] ? T[] | boolean

type A = M<number | string>

// type A = (number | string)[]
```

#### # 映射类型
```javascript
type OptionsFlags<T> = {
  [Property in keyof T]: boolean;
}

type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type F = OptionsFlags<FeatureFlags>

// type F = { darkMode: boolean; newUserProfile: boolean; }
```
映射修饰符
```javascript
type CreateMutable<T> = {
  - readonly [Property in keyof T] - ?: T[Property]
}

type LockedAccount = {
  readonly id: string;
  readonly name: string;
  readonly age?: number;
};

type UnLockedAccount = CreateMutable<LockedAccount>

// type UnLockedAccount = { id: string; name: string; age: number }
```
结合
```javascript
type ExtractPII<T> = {
  [Property in keyof T]: T[Property] extends { pii: true } ? true : false;
}

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true }
}

type D = ExtractPII<DBFields>

// type D = {
//    id: false;
//    name: true;
// }
```
键名重新映射
```javascript
type Getters<T> = {
  [Property in keyof T as `get${Capitalize<string & Property>}`]: () => T[Property];
}

interface Person {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person>

// type LazyPerson = {
//    getName: () => string;
//    getAge: () => number;
//    getLocation: () => string;
// }
```
```javascript
type RemoveKindField<T> = {
  [Property in keyof T as Exclude<Property, 'kind'>]: () => T[Property];
}

interface Circle {
    kind: "circle";
    radius: number;
}

type KindLessCirlce = RemoveKindField<Circle>

// type KindlessCircle = {
//    radius: number;
// }
```
```javascript
type EventConfig<Events extends { kind: string }> = {
  [E in Events as E["kind"]]: (event: E) => void
}

type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };
 
type Config = EventConfig<SquareEvent | CircleEvent>

// type Config = {
//  square: (event: SquareEvent) => void;
//  circle: (event: CircleEvent) => void;
//}
```