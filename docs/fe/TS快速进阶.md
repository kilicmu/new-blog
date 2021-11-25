## TS 类型快速进阶

本文demo的codesandbox地址：https://codesandbox.io/s/wild-thunder-cfn6z?file=/src/index.ts，写的比较着急，可能有的demo已经丢失。。。见谅。

先明确一个概念，TS存在类型空间（type space）和值空间（value space）两个概念。

同一个声明（如：class声明，enum声明）可能同时存在类型空间与值空间中，本文主要放在类型空间的使用讲解，值空间大部分可以理解为和 ES6+ 相差无几，掌握了 ES6+ 基本就理解了TS的值空间大部分概念。

希望本文读者对ES6语法有所掌握且了解TS的一些基础知识，如果完全不了解希望可以先看TS官方文档或handbook文档再看本文，本文不会重复纠结于文档内容。

### 前置知识

#### 类型与值与变量（别名）定义

简单理解，在TS类型系统中，我们可以简单的把类型看做是一个值的集合，如有类型: number，{-Infinity, 1, 2, 3, 4, .... , Infinity, NaN} ∈ number，则number可以被视为一个类型。

但是当一个类型作为最小子集的时候，类型本身则可以被视为值~。

举个小🌰：

声明别名A：

```ts
type A = number
const val: A = 1 // 编译通过
// or: const val: A = 2 // 编译通过
//...
```

此时对于类型系统来说，别名`A`可以看做一个数值集合，所以别名A本身可以被作为类型标注使用。

但是假如我们声明别名B：

```ts
type B = 1
```

此时，别名B对应最小集合 1，此时，别名仅可表示唯一值，则此别名我们可以视为一个值的定义而非类型。

在Typescript中，类型系统的变量定义可以通过type实现：

```ts
type variable = 1
// ==> 等价JS
const variable = 1
```

当然，变量的定义存在作用域的概念，TS类型变量作用域与JS有一些不同。在JavaScript中，存在很多的作用域概念，如：ES6以前的全局作用域、函数作用域、eval 作用域。ES6新增的块级作用域~。

TS类型系统中仅仅包含两个作用域：全局作用域与局部作用域。

全局作用域声明见以下Demo：

```ts
type globalVariable = ['foo', 'caa'] // 全局作用域的元组声明
```

局部作用域比较复杂，需要依靠 infer 来实现所需效果，如果看不懂可以暂时不去纠结，后面 infer 小结会做出讲解：

```ts
type B = ['foo', 'caa'] extends infer scopedVariable ? (
    scopedVariable // => 在这个括号的表达式范围内，scopedVariable 都被定义为 ['foo', 'caa'] 元组~
) : never  
```

#### extends

extends简单来说可以理解为定义类型的收敛，假设有 A extends B，代表 A 为 B 的子集。在 TS 中，我们经常会用 extends 来做一些泛型或类型的限定操作。

举个🌰：

```ts
type foo = 1 | 2 extends 1 | 2 | 3 ? true : false;
// => foo = true
type foo = [1] extends [1, 2, 3] ? true : false;
// => foo = false
type Foo = <T extends string | number>(arg: T) => void
const fn: Foo = (arg: Record<string, any>) => {}
// => Error: Type 'string | number' is not assignable to type 'Record<string, any>'.
```

结合上面的类型系统的值和类型两个维度概念，我们可以得出以下规律：

| 规则                 | 特性                                      |
| -------------------- | ----------------------------------------- |
| 值   extends    类型 | 判断值是否属于类型                        |
| 值   extends    值   | 两个值是否相等，等价于 编程语言的： `===` |
| 类型   extends  值   | 恒定为否                                  |
| 类型   extends  类型 | 前置类型是否为后置类型子集                |

基于这个规律，利用类型，我们也可以做到在类型系统做到语言级别的判断能力~

```ts
type result = 1 extends 1 ? true : false
// => 等价于
const result = 1 === 1 ? true : false
```

#### infer

infer在TS中算是一个比较难以理解的概念了。

简单来说，个人理解 infer 本质上是一种使得 extends 条件成立的推导（模式匹配）。

举个🌰：

假设，我们需要有一个别名为Fn的函数类型：

```ts
type Fn = (val: string) => void
```

假设我们需要拿到他的参数类型，当然，我们可以直接根据字面值写出来：

```ts
type Arg = string
```

但是如果有动态获取的需求，显然这么做不是很优雅。这种情况下，就可以借助 infer 的能力了。我们定义一个类型：GetArgs<T>来帮助我们快速获取函数参数:

```ts
type GetArgs<T> = T extends (arg: infer K) => any ? K : never
type args = GetArgs<Fn>
// => args = string
```

但是上面的这个推导存在一个问题。如果我们把Fn的定义改为如下形式，上面的定义显然就会失效：

```ts
type Fn = (val: string, foo: number) => void
type args = GetArgs<Fn>
// => args = never
```

至于为什么会失效，因为类型 (val: string, foo: number) => void 参数列表无论如何也无法匹配上 (args: K) => any的参数列表，所以只能触发了extends的false分支。获取到了never。

为了使得多参数函数类型使用GetArgs仍然可以获取正确的参数，可以把上述定义改为如下：

```ts
type GetArgs<T> = T extends (...args: infer K) => any ? K : never
type Fn = (val: string, foo: number) => void
type args = GetArgs<Fn>
// => args = [string, number]
```

但是获取的是一个类型元组，显然不符合我们预期~。不过我们可以再抽象一个类型方法，用来获取第n个参数类型。

```ts
type _GetNthArg<T extends unknown[], K> = T["length"] extends K ? T : _GetNthArg<[...T, unknown], K>
type GetNthArg<T, K> = T extends [..._GetNthArg<[], K>, infer R, ...infer RR] ? R : never

type secondParamType = GetNthArg<GetArgs<Fn>, 1>
// => secondParamType = number
```

这个例子其实故意用了复杂的写法，主要为了演示infer的能力，也可以直接用下标取值。

这个Demo因为TS类型没有闭包的能力。所以递归保存状态只能使用泛型传参，可能不是很优雅，但是仍然可以实现我们需要的效果。

对于递归，TS具有层数限制。当然，上面这种尾递归会被编译器优化，所以不存在问题触发TS递归深度限制问题，后面遇到相同问题将具体说明。

同理也可以写出RetureType的实现：

```ts
type RetureType<T extends (...args: any) => any> = T extends (...args: any[]) => infer K ? K : never
type rtResult = RetureType<Fn>
// => rtResult = void
```

ts内置了很多内置的类型方法，可以在`lib.es.d.ts`查看相关定义与使用文档~

#### 泛型

泛型可以看做接口或类型别名的参数~主要目的是实现组件结构（类、函数、类型等等）的复用。

对于类型系统，我们可以简单的把泛型想象为函数的参数~

举个🌰：

```ts
type judgeStr<T extends string> = T extends "hello" ? true : false
// => 等价于以 Go 为例的强类型语言：
func judgeStr(T string) bool {
	return T === "hello"
}
```

其实上面的几个小结已经用了很多的类型泛型，所以如果你能把上面的都搞懂了，我猜测对于泛型应该也没有什么恐惧了。所以这里我就一带而过了~

下面我们来说说重头戏——逆变、协变。

#### 逆变、协变

很多童鞋在写TS时，总是被编译器给出的满屏报错毒打~不知道你是否有过调来调去，发现仍然通不过编译，气的想要`rm -rf`的经历∠(°ゝ°)。

放心，只要你真正掌握了这一小结，这些问题都将迎刃而解~

先说说为什么需要变形吧：

##### 变形

几乎所有的类型编程语言都绕不开变形，类型系统更是无法绕开变形的存在。

对于类型来说，当然子类型相对于父类型存在更多的属性，且属性较多的类型为属性较少类型的子集：

```ts
interface Parent {
  pp(): void;
}

interface Son extends Parent {
  ss(): void;
}

type result = Son extends Parent ? true : false
// => true
```

但是对于集合系统相反：

```ts
type a = 1 | 2 | 3
type b = 1 | 2
type result = a extends b ? true : false
// => result = false
let aa: a 
let bb: b
aa = bb
// => no error
bb = aa
// => error: Type '3' is not assignable to type 'b'.
```

虽然违背了类型系统知觉，但是对于集合来说，对于类型a可能存在出现3的可能性，但是对于类型b不存在此元素，集合丢失了元素，显然属性更少的集合才是子集。

仔细观察上面的两个例子，看似矛盾，但是存在一个共同点：对于父类型来说，相对而言更加宽泛。而子类型则更加具体。所以子类型是可以赋值给父类型的。

##### 逆变和协变

定义：

**逆变（contra-variance）：子类型可以转换为父类型**

**协变（co-variance）：父类型可以转换为子类型**

假如有如下两个类型：

```ts
interface Father {
  doNormalThings(): void;
}

interface Son extends Father {
  doSpecialThings(): void;
}

// 若有两个函数签名：
type Fn1 = (father: Father) => void;
type Fn2 = (son: Son) => void;

let f1: Fn1 = (father: Father) => {};
let f2: Fn2 = (son: Son) => {};

f1 = f2
// => error：Property 'doSpecialThings' is missing in type 'Father' but required in type 'Son'.
f2 = f1
// => 编译通过
```

简单理解一下，对于函数参数来说，TS允许类型发生协变，对于Fn1的签名，father参数实例推导出的可使用属性皆为son实例属性的子集，所以签名为Fn1的变量赋值给签名为Fn2的变量显然是安全的。

再来看下面的例子，同样的Fn1和Fn2如下定义：

```ts
type Fn1 = () => Father;
type Fn2 = () => Son;

let f1: Fn1 = () => ({} as Father);
let f2: Fn2 = () => ({} as Son);

f1 = f2;
// => 编译通过
f2 = f1;
// => error: 'doSpecialThings' is declared here.
```

可见，对于函数返回值类型，TS采取了协变兼容的策略：即对于返回值的可能性进行收敛，保证重赋值后的函数返回值在后续类型推导保证安全。

##### 双变

参数类型既可以协变又可以逆变~（及其不安全），请通过strictFunctionTypes` 或 `strict：true来关闭这个功能。

##### 不变

完全不兼容，则会发生不变。举个例子：

```ts
interface T1 {
  a: numebr;
}
interface T2 {
  b: number;
}

let a: T1 = {a: 1}
let b: T2 = {b: 2}
a = b
// => error: Property 'a' is missing in type 'T2' but required in type 'T1'.
```

两者完全无法兼容，显然TS无需做出逆变或协变的兼容，直接报错。。。

这里多插一句，虽然TS存在extends语法，但是其实TS的继承本质上仍然是基于structual typing实现，所以存在下面的🌰：

```ts
class vector2D{
  constructor(public x:number, public y: number){
    this.x = x;
    this.y = y;
  }
}
class vector3D{
  constructor(public x:number,public y:number,public z:number){
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
function calculateLength(v: vector2D){
  return Math.sqrt(v.x*v.x + v.y*v.y)
}
const point = new vector3D(0,1,2)
const dist = calculateLength(point)
// => 编译通过
```

想要更好的理解这个部分，本质上还是要理解类型空间，从类型的层面去思考安全才会更好理解TS的变形处理思路。

### 做个题？

#### 菲波那切数列

小明去微软面试，其中有一道手写代码题。题干很简单：用TS求出斐波那契数列第N个值~

好家伙，这个简单啊，于是小明没等面试官说完，刷刷刷半分钟一个递归写出来了：

```js
const fib = (n: number): number => {
   if(n === 1 || n === 2) return 1;
   return fib(n - 1) + fib(n - 2)
}
```

很可惜这只是小明的一厢情愿了😭~，在小明期盼的目光下，面试官缓缓说出后半句话——请用类型实现。

小明傻眼了，这可咋做呀。。。

有了上面的前置知识，其实我相信你已经可以做出来这道题了，如果做不出来那就看小明是怎么解题的吧：

小明发现这道题看起来也很简单，只要把上面的函数转换为类型系统就可以了，于是写下了下面的定义：

```ts
type Fib<N extends number> = N extends 0 | 1 ? Fib<N - 1> + Fib<N - 2>
// 编译不通过
```

显然，对于TS来说，没有这种语法的，让小明感到很头秃，怎么实现加减运算呢？类型系统显然不支持加减运算啊？

聪明的小明突然想到之前看到的前置知识：

对于类型`T[]`，有：

```ts
type result = [unknown, unknown]["length"]
// => 2
```

这太让人兴奋了，可以通过构建数组来实现加法操作啊~

于是小明写下了如下声明：

```ts
export type NArray<T, N extends number> = N extends N ? (number extends N ? T[] : _NArray<T, N, []>) : never
type _NArray<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _NArray<T, N, [T, ...R]>
type NArrayNumber<L extends number> = NArray<number, L>

export type Add<M extends number, N extends number> = [...NArrayNumber<M>, ...NArrayNumber<N>]['length']
```

测试了一下：

```ts
type result = Add<1, 2>
// => result = 3
```

确实可以，于是小明模仿着写出了减法操作：

```ts
export type Subtract<M extends number, N extends number> =
    NArrayNumber<M> extends [...x: NArrayNumber<N>, ...rest: infer R] ? R['length'] : unknown
```

测试一下：

```ts
type result = Subtract<2, 1>
// => result = 1
```

小明感觉offer快要到手了，他改造了之前的Fib声明：

```ts
type Fib<N extends number> =
     N extends (0 | 1) ?
     1 : Add<Fib<Subtract<N, 1>>, Fib<Subtract<N, 2>>>
// => error: Type instantiation is excessively deep and possibly infinite.
```

嗯？？小明绝望的发现，怎么还有报错？其实这个不是小明的问题，是TS为了避免类型深度递归造成的爆栈问题，选择了限制最深50层的递归深度，可以通过升级TS版本解决这个问题。

所以小明还是顺利的拿到了offer。

// PS: 写到这里突然发现口子开的有点大，可能这篇文章博客将被拆成两个部分吧。。。下一篇主要说一些技巧和TS的一些陷阱。。。

未完待续。
