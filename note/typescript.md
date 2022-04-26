### Typescript

##### # 基础
静态类型系统是替代Javascript原本动态系统的解决方案.

##### # ts.config
strictNullChecks: 在使用可能为null或者undefined之前进行检验.
noImplicitAny: 隐式推断为any时进行报错.

##### # type和interface区别
type可以做类型别名, interface不可以.
type通过交集(&)进行扩展, interface通过继承(extends)进行扩展.
type无法修改已经定义过字段对应的数据类型, interface可以修改.

##### # 可辩别联合
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

##### # never穷尽检查
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

##### # 调用签名
```javascript
type DescribableFunction = {
    description: string;
    (someArg: number): boolean;
}

function doSomething(fn: DescribableFunction) {
    console.log(fn.description + " returned " + fn(6) )
}
```

##### # 构造签名
```javascript
type SomeConstructor = {
    new (s: string): SomeObject;
}

type CallOrConstruct {
    new (s: string): Date;
    (n?: number): number;
}
```

##### # 函数类型 ?
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

##### # 剩余参数 ?
```javascript
const args = [8, 5] as const
const angle = Math.atan2(..args)
```

##### # 参数解构
```javascript
function sum({a, b, c}: {a: number, b: number: c: number}) {
    return a + b + c
}
```

##### # 函数的可赋值性
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