
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Property
 * 
 */
export type Property = $Result.DefaultSelection<Prisma.$PropertyPayload>
/**
 * Model Lead
 * 
 */
export type Lead = $Result.DefaultSelection<Prisma.$LeadPayload>
/**
 * Model Appointment
 * 
 */
export type Appointment = $Result.DefaultSelection<Prisma.$AppointmentPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
/**
 * Model Call
 * 
 */
export type Call = $Result.DefaultSelection<Prisma.$CallPayload>
/**
 * Model TaskList
 * 
 */
export type TaskList = $Result.DefaultSelection<Prisma.$TaskListPayload>
/**
 * Model Task
 * 
 */
export type Task = $Result.DefaultSelection<Prisma.$TaskPayload>
/**
 * Model Page
 * 
 */
export type Page = $Result.DefaultSelection<Prisma.$PagePayload>
/**
 * Model Section
 * 
 */
export type Section = $Result.DefaultSelection<Prisma.$SectionPayload>
/**
 * Model SiteSettings
 * 
 */
export type SiteSettings = $Result.DefaultSelection<Prisma.$SiteSettingsPayload>
/**
 * Model AiUsage
 * 
 */
export type AiUsage = $Result.DefaultSelection<Prisma.$AiUsagePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.property`: Exposes CRUD operations for the **Property** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Properties
    * const properties = await prisma.property.findMany()
    * ```
    */
  get property(): Prisma.PropertyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lead`: Exposes CRUD operations for the **Lead** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Leads
    * const leads = await prisma.lead.findMany()
    * ```
    */
  get lead(): Prisma.LeadDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.appointment`: Exposes CRUD operations for the **Appointment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Appointments
    * const appointments = await prisma.appointment.findMany()
    * ```
    */
  get appointment(): Prisma.AppointmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.call`: Exposes CRUD operations for the **Call** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Calls
    * const calls = await prisma.call.findMany()
    * ```
    */
  get call(): Prisma.CallDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.taskList`: Exposes CRUD operations for the **TaskList** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TaskLists
    * const taskLists = await prisma.taskList.findMany()
    * ```
    */
  get taskList(): Prisma.TaskListDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **Task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.TaskDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.page`: Exposes CRUD operations for the **Page** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pages
    * const pages = await prisma.page.findMany()
    * ```
    */
  get page(): Prisma.PageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.section`: Exposes CRUD operations for the **Section** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sections
    * const sections = await prisma.section.findMany()
    * ```
    */
  get section(): Prisma.SectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.siteSettings`: Exposes CRUD operations for the **SiteSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SiteSettings
    * const siteSettings = await prisma.siteSettings.findMany()
    * ```
    */
  get siteSettings(): Prisma.SiteSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiUsage`: Exposes CRUD operations for the **AiUsage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiUsages
    * const aiUsages = await prisma.aiUsage.findMany()
    * ```
    */
  get aiUsage(): Prisma.AiUsageDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Property: 'Property',
    Lead: 'Lead',
    Appointment: 'Appointment',
    Message: 'Message',
    Call: 'Call',
    TaskList: 'TaskList',
    Task: 'Task',
    Page: 'Page',
    Section: 'Section',
    SiteSettings: 'SiteSettings',
    AiUsage: 'AiUsage'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "property" | "lead" | "appointment" | "message" | "call" | "taskList" | "task" | "page" | "section" | "siteSettings" | "aiUsage"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Property: {
        payload: Prisma.$PropertyPayload<ExtArgs>
        fields: Prisma.PropertyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PropertyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PropertyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          findFirst: {
            args: Prisma.PropertyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PropertyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          findMany: {
            args: Prisma.PropertyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          create: {
            args: Prisma.PropertyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          createMany: {
            args: Prisma.PropertyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PropertyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          delete: {
            args: Prisma.PropertyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          update: {
            args: Prisma.PropertyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          deleteMany: {
            args: Prisma.PropertyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PropertyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PropertyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          upsert: {
            args: Prisma.PropertyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          aggregate: {
            args: Prisma.PropertyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProperty>
          }
          groupBy: {
            args: Prisma.PropertyGroupByArgs<ExtArgs>
            result: $Utils.Optional<PropertyGroupByOutputType>[]
          }
          count: {
            args: Prisma.PropertyCountArgs<ExtArgs>
            result: $Utils.Optional<PropertyCountAggregateOutputType> | number
          }
        }
      }
      Lead: {
        payload: Prisma.$LeadPayload<ExtArgs>
        fields: Prisma.LeadFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LeadFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LeadFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          findFirst: {
            args: Prisma.LeadFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LeadFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          findMany: {
            args: Prisma.LeadFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>[]
          }
          create: {
            args: Prisma.LeadCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          createMany: {
            args: Prisma.LeadCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LeadCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>[]
          }
          delete: {
            args: Prisma.LeadDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          update: {
            args: Prisma.LeadUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          deleteMany: {
            args: Prisma.LeadDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LeadUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LeadUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>[]
          }
          upsert: {
            args: Prisma.LeadUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          aggregate: {
            args: Prisma.LeadAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLead>
          }
          groupBy: {
            args: Prisma.LeadGroupByArgs<ExtArgs>
            result: $Utils.Optional<LeadGroupByOutputType>[]
          }
          count: {
            args: Prisma.LeadCountArgs<ExtArgs>
            result: $Utils.Optional<LeadCountAggregateOutputType> | number
          }
        }
      }
      Appointment: {
        payload: Prisma.$AppointmentPayload<ExtArgs>
        fields: Prisma.AppointmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppointmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppointmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findFirst: {
            args: Prisma.AppointmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppointmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findMany: {
            args: Prisma.AppointmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          create: {
            args: Prisma.AppointmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          createMany: {
            args: Prisma.AppointmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppointmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          delete: {
            args: Prisma.AppointmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          update: {
            args: Prisma.AppointmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          deleteMany: {
            args: Prisma.AppointmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppointmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AppointmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          upsert: {
            args: Prisma.AppointmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          aggregate: {
            args: Prisma.AppointmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppointment>
          }
          groupBy: {
            args: Prisma.AppointmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppointmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppointmentCountArgs<ExtArgs>
            result: $Utils.Optional<AppointmentCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      Call: {
        payload: Prisma.$CallPayload<ExtArgs>
        fields: Prisma.CallFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CallFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CallFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          findFirst: {
            args: Prisma.CallFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CallFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          findMany: {
            args: Prisma.CallFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>[]
          }
          create: {
            args: Prisma.CallCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          createMany: {
            args: Prisma.CallCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CallCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>[]
          }
          delete: {
            args: Prisma.CallDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          update: {
            args: Prisma.CallUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          deleteMany: {
            args: Prisma.CallDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CallUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CallUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>[]
          }
          upsert: {
            args: Prisma.CallUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          aggregate: {
            args: Prisma.CallAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCall>
          }
          groupBy: {
            args: Prisma.CallGroupByArgs<ExtArgs>
            result: $Utils.Optional<CallGroupByOutputType>[]
          }
          count: {
            args: Prisma.CallCountArgs<ExtArgs>
            result: $Utils.Optional<CallCountAggregateOutputType> | number
          }
        }
      }
      TaskList: {
        payload: Prisma.$TaskListPayload<ExtArgs>
        fields: Prisma.TaskListFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskListFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskListPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskListFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskListPayload>
          }
          findFirst: {
            args: Prisma.TaskListFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskListPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskListFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskListPayload>
          }
          findMany: {
            args: Prisma.TaskListFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskListPayload>[]
          }
          create: {
            args: Prisma.TaskListCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskListPayload>
          }
          createMany: {
            args: Prisma.TaskListCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskListCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskListPayload>[]
          }
          delete: {
            args: Prisma.TaskListDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskListPayload>
          }
          update: {
            args: Prisma.TaskListUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskListPayload>
          }
          deleteMany: {
            args: Prisma.TaskListDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskListUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaskListUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskListPayload>[]
          }
          upsert: {
            args: Prisma.TaskListUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskListPayload>
          }
          aggregate: {
            args: Prisma.TaskListAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaskList>
          }
          groupBy: {
            args: Prisma.TaskListGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskListGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskListCountArgs<ExtArgs>
            result: $Utils.Optional<TaskListCountAggregateOutputType> | number
          }
        }
      }
      Task: {
        payload: Prisma.$TaskPayload<ExtArgs>
        fields: Prisma.TaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findFirst: {
            args: Prisma.TaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findMany: {
            args: Prisma.TaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          create: {
            args: Prisma.TaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          createMany: {
            args: Prisma.TaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          delete: {
            args: Prisma.TaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          update: {
            args: Prisma.TaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          deleteMany: {
            args: Prisma.TaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaskUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          upsert: {
            args: Prisma.TaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          aggregate: {
            args: Prisma.TaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTask>
          }
          groupBy: {
            args: Prisma.TaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCountAggregateOutputType> | number
          }
        }
      }
      Page: {
        payload: Prisma.$PagePayload<ExtArgs>
        fields: Prisma.PageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagePayload>
          }
          findFirst: {
            args: Prisma.PageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagePayload>
          }
          findMany: {
            args: Prisma.PageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagePayload>[]
          }
          create: {
            args: Prisma.PageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagePayload>
          }
          createMany: {
            args: Prisma.PageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagePayload>[]
          }
          delete: {
            args: Prisma.PageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagePayload>
          }
          update: {
            args: Prisma.PageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagePayload>
          }
          deleteMany: {
            args: Prisma.PageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagePayload>[]
          }
          upsert: {
            args: Prisma.PageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagePayload>
          }
          aggregate: {
            args: Prisma.PageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePage>
          }
          groupBy: {
            args: Prisma.PageGroupByArgs<ExtArgs>
            result: $Utils.Optional<PageGroupByOutputType>[]
          }
          count: {
            args: Prisma.PageCountArgs<ExtArgs>
            result: $Utils.Optional<PageCountAggregateOutputType> | number
          }
        }
      }
      Section: {
        payload: Prisma.$SectionPayload<ExtArgs>
        fields: Prisma.SectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>
          }
          findFirst: {
            args: Prisma.SectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>
          }
          findMany: {
            args: Prisma.SectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>[]
          }
          create: {
            args: Prisma.SectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>
          }
          createMany: {
            args: Prisma.SectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>[]
          }
          delete: {
            args: Prisma.SectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>
          }
          update: {
            args: Prisma.SectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>
          }
          deleteMany: {
            args: Prisma.SectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>[]
          }
          upsert: {
            args: Prisma.SectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>
          }
          aggregate: {
            args: Prisma.SectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSection>
          }
          groupBy: {
            args: Prisma.SectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SectionCountArgs<ExtArgs>
            result: $Utils.Optional<SectionCountAggregateOutputType> | number
          }
        }
      }
      SiteSettings: {
        payload: Prisma.$SiteSettingsPayload<ExtArgs>
        fields: Prisma.SiteSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SiteSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SiteSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>
          }
          findFirst: {
            args: Prisma.SiteSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SiteSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>
          }
          findMany: {
            args: Prisma.SiteSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>[]
          }
          create: {
            args: Prisma.SiteSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>
          }
          createMany: {
            args: Prisma.SiteSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SiteSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>[]
          }
          delete: {
            args: Prisma.SiteSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>
          }
          update: {
            args: Prisma.SiteSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>
          }
          deleteMany: {
            args: Prisma.SiteSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SiteSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SiteSettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>[]
          }
          upsert: {
            args: Prisma.SiteSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>
          }
          aggregate: {
            args: Prisma.SiteSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSiteSettings>
          }
          groupBy: {
            args: Prisma.SiteSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SiteSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.SiteSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<SiteSettingsCountAggregateOutputType> | number
          }
        }
      }
      AiUsage: {
        payload: Prisma.$AiUsagePayload<ExtArgs>
        fields: Prisma.AiUsageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiUsageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiUsageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsagePayload>
          }
          findFirst: {
            args: Prisma.AiUsageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiUsageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsagePayload>
          }
          findMany: {
            args: Prisma.AiUsageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsagePayload>[]
          }
          create: {
            args: Prisma.AiUsageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsagePayload>
          }
          createMany: {
            args: Prisma.AiUsageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiUsageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsagePayload>[]
          }
          delete: {
            args: Prisma.AiUsageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsagePayload>
          }
          update: {
            args: Prisma.AiUsageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsagePayload>
          }
          deleteMany: {
            args: Prisma.AiUsageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiUsageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiUsageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsagePayload>[]
          }
          upsert: {
            args: Prisma.AiUsageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsagePayload>
          }
          aggregate: {
            args: Prisma.AiUsageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiUsage>
          }
          groupBy: {
            args: Prisma.AiUsageGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiUsageGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiUsageCountArgs<ExtArgs>
            result: $Utils.Optional<AiUsageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    property?: PropertyOmit
    lead?: LeadOmit
    appointment?: AppointmentOmit
    message?: MessageOmit
    call?: CallOmit
    taskList?: TaskListOmit
    task?: TaskOmit
    page?: PageOmit
    section?: SectionOmit
    siteSettings?: SiteSettingsOmit
    aiUsage?: AiUsageOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    leads: number
    tasks: number
    appointments: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    leads?: boolean | UserCountOutputTypeCountLeadsArgs
    tasks?: boolean | UserCountOutputTypeCountTasksArgs
    appointments?: boolean | UserCountOutputTypeCountAppointmentsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLeadsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeadWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }


  /**
   * Count Type PropertyCountOutputType
   */

  export type PropertyCountOutputType = {
    leads: number
  }

  export type PropertyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    leads?: boolean | PropertyCountOutputTypeCountLeadsArgs
  }

  // Custom InputTypes
  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyCountOutputType
     */
    select?: PropertyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountLeadsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeadWhereInput
  }


  /**
   * Count Type LeadCountOutputType
   */

  export type LeadCountOutputType = {
    calls: number
    tasks: number
    appointments: number
    messages: number
  }

  export type LeadCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    calls?: boolean | LeadCountOutputTypeCountCallsArgs
    tasks?: boolean | LeadCountOutputTypeCountTasksArgs
    appointments?: boolean | LeadCountOutputTypeCountAppointmentsArgs
    messages?: boolean | LeadCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * LeadCountOutputType without action
   */
  export type LeadCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadCountOutputType
     */
    select?: LeadCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LeadCountOutputType without action
   */
  export type LeadCountOutputTypeCountCallsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CallWhereInput
  }

  /**
   * LeadCountOutputType without action
   */
  export type LeadCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * LeadCountOutputType without action
   */
  export type LeadCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }

  /**
   * LeadCountOutputType without action
   */
  export type LeadCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Count Type TaskListCountOutputType
   */

  export type TaskListCountOutputType = {
    tasks: number
  }

  export type TaskListCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | TaskListCountOutputTypeCountTasksArgs
  }

  // Custom InputTypes
  /**
   * TaskListCountOutputType without action
   */
  export type TaskListCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskListCountOutputType
     */
    select?: TaskListCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TaskListCountOutputType without action
   */
  export type TaskListCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }


  /**
   * Count Type PageCountOutputType
   */

  export type PageCountOutputType = {
    sections: number
  }

  export type PageCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sections?: boolean | PageCountOutputTypeCountSectionsArgs
  }

  // Custom InputTypes
  /**
   * PageCountOutputType without action
   */
  export type PageCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageCountOutputType
     */
    select?: PageCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PageCountOutputType without action
   */
  export type PageCountOutputTypeCountSectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SectionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    role: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string
    role: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    leads?: boolean | User$leadsArgs<ExtArgs>
    tasks?: boolean | User$tasksArgs<ExtArgs>
    appointments?: boolean | User$appointmentsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    leads?: boolean | User$leadsArgs<ExtArgs>
    tasks?: boolean | User$tasksArgs<ExtArgs>
    appointments?: boolean | User$appointmentsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      leads: Prisma.$LeadPayload<ExtArgs>[]
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string
      role: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    leads<T extends User$leadsArgs<ExtArgs> = {}>(args?: Subset<T, User$leadsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tasks<T extends User$tasksArgs<ExtArgs> = {}>(args?: Subset<T, User$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    appointments<T extends User$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, User$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.leads
   */
  export type User$leadsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    where?: LeadWhereInput
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    cursor?: LeadWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * User.tasks
   */
  export type User$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * User.appointments
   */
  export type User$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Property
   */

  export type AggregateProperty = {
    _count: PropertyCountAggregateOutputType | null
    _avg: PropertyAvgAggregateOutputType | null
    _sum: PropertySumAggregateOutputType | null
    _min: PropertyMinAggregateOutputType | null
    _max: PropertyMaxAggregateOutputType | null
  }

  export type PropertyAvgAggregateOutputType = {
    price: Decimal | null
    minPrice: Decimal | null
    maxPrice: Decimal | null
    bedrooms: number | null
    bathrooms: number | null
    area: number | null
    availableUnits: number | null
  }

  export type PropertySumAggregateOutputType = {
    price: Decimal | null
    minPrice: Decimal | null
    maxPrice: Decimal | null
    bedrooms: number | null
    bathrooms: number | null
    area: number | null
    availableUnits: number | null
  }

  export type PropertyMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    price: Decimal | null
    minPrice: Decimal | null
    maxPrice: Decimal | null
    type: string | null
    status: string | null
    location: string | null
    bedrooms: number | null
    bathrooms: number | null
    area: number | null
    availableUnits: number | null
    deliveryDate: string | null
    images: string | null
    presentations: string | null
    nearbyPlaces: string | null
    dynamicFeatures: string | null
    independentUnit: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ownerName: string | null
    ownerPhone: string | null
    ownerEmail: string | null
    ownerNotes: string | null
  }

  export type PropertyMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    price: Decimal | null
    minPrice: Decimal | null
    maxPrice: Decimal | null
    type: string | null
    status: string | null
    location: string | null
    bedrooms: number | null
    bathrooms: number | null
    area: number | null
    availableUnits: number | null
    deliveryDate: string | null
    images: string | null
    presentations: string | null
    nearbyPlaces: string | null
    dynamicFeatures: string | null
    independentUnit: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ownerName: string | null
    ownerPhone: string | null
    ownerEmail: string | null
    ownerNotes: string | null
  }

  export type PropertyCountAggregateOutputType = {
    id: number
    title: number
    description: number
    price: number
    minPrice: number
    maxPrice: number
    type: number
    status: number
    location: number
    bedrooms: number
    bathrooms: number
    area: number
    availableUnits: number
    deliveryDate: number
    images: number
    presentations: number
    nearbyPlaces: number
    dynamicFeatures: number
    independentUnit: number
    createdAt: number
    updatedAt: number
    ownerName: number
    ownerPhone: number
    ownerEmail: number
    ownerNotes: number
    _all: number
  }


  export type PropertyAvgAggregateInputType = {
    price?: true
    minPrice?: true
    maxPrice?: true
    bedrooms?: true
    bathrooms?: true
    area?: true
    availableUnits?: true
  }

  export type PropertySumAggregateInputType = {
    price?: true
    minPrice?: true
    maxPrice?: true
    bedrooms?: true
    bathrooms?: true
    area?: true
    availableUnits?: true
  }

  export type PropertyMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    price?: true
    minPrice?: true
    maxPrice?: true
    type?: true
    status?: true
    location?: true
    bedrooms?: true
    bathrooms?: true
    area?: true
    availableUnits?: true
    deliveryDate?: true
    images?: true
    presentations?: true
    nearbyPlaces?: true
    dynamicFeatures?: true
    independentUnit?: true
    createdAt?: true
    updatedAt?: true
    ownerName?: true
    ownerPhone?: true
    ownerEmail?: true
    ownerNotes?: true
  }

  export type PropertyMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    price?: true
    minPrice?: true
    maxPrice?: true
    type?: true
    status?: true
    location?: true
    bedrooms?: true
    bathrooms?: true
    area?: true
    availableUnits?: true
    deliveryDate?: true
    images?: true
    presentations?: true
    nearbyPlaces?: true
    dynamicFeatures?: true
    independentUnit?: true
    createdAt?: true
    updatedAt?: true
    ownerName?: true
    ownerPhone?: true
    ownerEmail?: true
    ownerNotes?: true
  }

  export type PropertyCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    price?: true
    minPrice?: true
    maxPrice?: true
    type?: true
    status?: true
    location?: true
    bedrooms?: true
    bathrooms?: true
    area?: true
    availableUnits?: true
    deliveryDate?: true
    images?: true
    presentations?: true
    nearbyPlaces?: true
    dynamicFeatures?: true
    independentUnit?: true
    createdAt?: true
    updatedAt?: true
    ownerName?: true
    ownerPhone?: true
    ownerEmail?: true
    ownerNotes?: true
    _all?: true
  }

  export type PropertyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Property to aggregate.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Properties
    **/
    _count?: true | PropertyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PropertyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PropertySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PropertyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PropertyMaxAggregateInputType
  }

  export type GetPropertyAggregateType<T extends PropertyAggregateArgs> = {
        [P in keyof T & keyof AggregateProperty]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProperty[P]>
      : GetScalarType<T[P], AggregateProperty[P]>
  }




  export type PropertyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyWhereInput
    orderBy?: PropertyOrderByWithAggregationInput | PropertyOrderByWithAggregationInput[]
    by: PropertyScalarFieldEnum[] | PropertyScalarFieldEnum
    having?: PropertyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PropertyCountAggregateInputType | true
    _avg?: PropertyAvgAggregateInputType
    _sum?: PropertySumAggregateInputType
    _min?: PropertyMinAggregateInputType
    _max?: PropertyMaxAggregateInputType
  }

  export type PropertyGroupByOutputType = {
    id: string
    title: string
    description: string | null
    price: Decimal
    minPrice: Decimal | null
    maxPrice: Decimal | null
    type: string
    status: string
    location: string
    bedrooms: number | null
    bathrooms: number | null
    area: number | null
    availableUnits: number | null
    deliveryDate: string | null
    images: string | null
    presentations: string | null
    nearbyPlaces: string | null
    dynamicFeatures: string | null
    independentUnit: string | null
    createdAt: Date
    updatedAt: Date
    ownerName: string | null
    ownerPhone: string | null
    ownerEmail: string | null
    ownerNotes: string | null
    _count: PropertyCountAggregateOutputType | null
    _avg: PropertyAvgAggregateOutputType | null
    _sum: PropertySumAggregateOutputType | null
    _min: PropertyMinAggregateOutputType | null
    _max: PropertyMaxAggregateOutputType | null
  }

  type GetPropertyGroupByPayload<T extends PropertyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PropertyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PropertyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PropertyGroupByOutputType[P]>
            : GetScalarType<T[P], PropertyGroupByOutputType[P]>
        }
      >
    >


  export type PropertySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    minPrice?: boolean
    maxPrice?: boolean
    type?: boolean
    status?: boolean
    location?: boolean
    bedrooms?: boolean
    bathrooms?: boolean
    area?: boolean
    availableUnits?: boolean
    deliveryDate?: boolean
    images?: boolean
    presentations?: boolean
    nearbyPlaces?: boolean
    dynamicFeatures?: boolean
    independentUnit?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ownerName?: boolean
    ownerPhone?: boolean
    ownerEmail?: boolean
    ownerNotes?: boolean
    leads?: boolean | Property$leadsArgs<ExtArgs>
    _count?: boolean | PropertyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["property"]>

  export type PropertySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    minPrice?: boolean
    maxPrice?: boolean
    type?: boolean
    status?: boolean
    location?: boolean
    bedrooms?: boolean
    bathrooms?: boolean
    area?: boolean
    availableUnits?: boolean
    deliveryDate?: boolean
    images?: boolean
    presentations?: boolean
    nearbyPlaces?: boolean
    dynamicFeatures?: boolean
    independentUnit?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ownerName?: boolean
    ownerPhone?: boolean
    ownerEmail?: boolean
    ownerNotes?: boolean
  }, ExtArgs["result"]["property"]>

  export type PropertySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    minPrice?: boolean
    maxPrice?: boolean
    type?: boolean
    status?: boolean
    location?: boolean
    bedrooms?: boolean
    bathrooms?: boolean
    area?: boolean
    availableUnits?: boolean
    deliveryDate?: boolean
    images?: boolean
    presentations?: boolean
    nearbyPlaces?: boolean
    dynamicFeatures?: boolean
    independentUnit?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ownerName?: boolean
    ownerPhone?: boolean
    ownerEmail?: boolean
    ownerNotes?: boolean
  }, ExtArgs["result"]["property"]>

  export type PropertySelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    price?: boolean
    minPrice?: boolean
    maxPrice?: boolean
    type?: boolean
    status?: boolean
    location?: boolean
    bedrooms?: boolean
    bathrooms?: boolean
    area?: boolean
    availableUnits?: boolean
    deliveryDate?: boolean
    images?: boolean
    presentations?: boolean
    nearbyPlaces?: boolean
    dynamicFeatures?: boolean
    independentUnit?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ownerName?: boolean
    ownerPhone?: boolean
    ownerEmail?: boolean
    ownerNotes?: boolean
  }

  export type PropertyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "price" | "minPrice" | "maxPrice" | "type" | "status" | "location" | "bedrooms" | "bathrooms" | "area" | "availableUnits" | "deliveryDate" | "images" | "presentations" | "nearbyPlaces" | "dynamicFeatures" | "independentUnit" | "createdAt" | "updatedAt" | "ownerName" | "ownerPhone" | "ownerEmail" | "ownerNotes", ExtArgs["result"]["property"]>
  export type PropertyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    leads?: boolean | Property$leadsArgs<ExtArgs>
    _count?: boolean | PropertyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PropertyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PropertyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PropertyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Property"
    objects: {
      leads: Prisma.$LeadPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      price: Prisma.Decimal
      minPrice: Prisma.Decimal | null
      maxPrice: Prisma.Decimal | null
      type: string
      status: string
      location: string
      bedrooms: number | null
      bathrooms: number | null
      area: number | null
      availableUnits: number | null
      deliveryDate: string | null
      images: string | null
      presentations: string | null
      nearbyPlaces: string | null
      dynamicFeatures: string | null
      independentUnit: string | null
      createdAt: Date
      updatedAt: Date
      ownerName: string | null
      ownerPhone: string | null
      ownerEmail: string | null
      ownerNotes: string | null
    }, ExtArgs["result"]["property"]>
    composites: {}
  }

  type PropertyGetPayload<S extends boolean | null | undefined | PropertyDefaultArgs> = $Result.GetResult<Prisma.$PropertyPayload, S>

  type PropertyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PropertyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PropertyCountAggregateInputType | true
    }

  export interface PropertyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Property'], meta: { name: 'Property' } }
    /**
     * Find zero or one Property that matches the filter.
     * @param {PropertyFindUniqueArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PropertyFindUniqueArgs>(args: SelectSubset<T, PropertyFindUniqueArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Property that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PropertyFindUniqueOrThrowArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PropertyFindUniqueOrThrowArgs>(args: SelectSubset<T, PropertyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Property that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindFirstArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PropertyFindFirstArgs>(args?: SelectSubset<T, PropertyFindFirstArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Property that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindFirstOrThrowArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PropertyFindFirstOrThrowArgs>(args?: SelectSubset<T, PropertyFindFirstOrThrowArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Properties that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Properties
     * const properties = await prisma.property.findMany()
     * 
     * // Get first 10 Properties
     * const properties = await prisma.property.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const propertyWithIdOnly = await prisma.property.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PropertyFindManyArgs>(args?: SelectSubset<T, PropertyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Property.
     * @param {PropertyCreateArgs} args - Arguments to create a Property.
     * @example
     * // Create one Property
     * const Property = await prisma.property.create({
     *   data: {
     *     // ... data to create a Property
     *   }
     * })
     * 
     */
    create<T extends PropertyCreateArgs>(args: SelectSubset<T, PropertyCreateArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Properties.
     * @param {PropertyCreateManyArgs} args - Arguments to create many Properties.
     * @example
     * // Create many Properties
     * const property = await prisma.property.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PropertyCreateManyArgs>(args?: SelectSubset<T, PropertyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Properties and returns the data saved in the database.
     * @param {PropertyCreateManyAndReturnArgs} args - Arguments to create many Properties.
     * @example
     * // Create many Properties
     * const property = await prisma.property.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Properties and only return the `id`
     * const propertyWithIdOnly = await prisma.property.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PropertyCreateManyAndReturnArgs>(args?: SelectSubset<T, PropertyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Property.
     * @param {PropertyDeleteArgs} args - Arguments to delete one Property.
     * @example
     * // Delete one Property
     * const Property = await prisma.property.delete({
     *   where: {
     *     // ... filter to delete one Property
     *   }
     * })
     * 
     */
    delete<T extends PropertyDeleteArgs>(args: SelectSubset<T, PropertyDeleteArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Property.
     * @param {PropertyUpdateArgs} args - Arguments to update one Property.
     * @example
     * // Update one Property
     * const property = await prisma.property.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PropertyUpdateArgs>(args: SelectSubset<T, PropertyUpdateArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Properties.
     * @param {PropertyDeleteManyArgs} args - Arguments to filter Properties to delete.
     * @example
     * // Delete a few Properties
     * const { count } = await prisma.property.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PropertyDeleteManyArgs>(args?: SelectSubset<T, PropertyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Properties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Properties
     * const property = await prisma.property.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PropertyUpdateManyArgs>(args: SelectSubset<T, PropertyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Properties and returns the data updated in the database.
     * @param {PropertyUpdateManyAndReturnArgs} args - Arguments to update many Properties.
     * @example
     * // Update many Properties
     * const property = await prisma.property.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Properties and only return the `id`
     * const propertyWithIdOnly = await prisma.property.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PropertyUpdateManyAndReturnArgs>(args: SelectSubset<T, PropertyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Property.
     * @param {PropertyUpsertArgs} args - Arguments to update or create a Property.
     * @example
     * // Update or create a Property
     * const property = await prisma.property.upsert({
     *   create: {
     *     // ... data to create a Property
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Property we want to update
     *   }
     * })
     */
    upsert<T extends PropertyUpsertArgs>(args: SelectSubset<T, PropertyUpsertArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Properties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyCountArgs} args - Arguments to filter Properties to count.
     * @example
     * // Count the number of Properties
     * const count = await prisma.property.count({
     *   where: {
     *     // ... the filter for the Properties we want to count
     *   }
     * })
    **/
    count<T extends PropertyCountArgs>(
      args?: Subset<T, PropertyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PropertyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Property.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PropertyAggregateArgs>(args: Subset<T, PropertyAggregateArgs>): Prisma.PrismaPromise<GetPropertyAggregateType<T>>

    /**
     * Group by Property.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PropertyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PropertyGroupByArgs['orderBy'] }
        : { orderBy?: PropertyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PropertyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPropertyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Property model
   */
  readonly fields: PropertyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Property.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PropertyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    leads<T extends Property$leadsArgs<ExtArgs> = {}>(args?: Subset<T, Property$leadsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Property model
   */
  interface PropertyFieldRefs {
    readonly id: FieldRef<"Property", 'String'>
    readonly title: FieldRef<"Property", 'String'>
    readonly description: FieldRef<"Property", 'String'>
    readonly price: FieldRef<"Property", 'Decimal'>
    readonly minPrice: FieldRef<"Property", 'Decimal'>
    readonly maxPrice: FieldRef<"Property", 'Decimal'>
    readonly type: FieldRef<"Property", 'String'>
    readonly status: FieldRef<"Property", 'String'>
    readonly location: FieldRef<"Property", 'String'>
    readonly bedrooms: FieldRef<"Property", 'Int'>
    readonly bathrooms: FieldRef<"Property", 'Int'>
    readonly area: FieldRef<"Property", 'Float'>
    readonly availableUnits: FieldRef<"Property", 'Int'>
    readonly deliveryDate: FieldRef<"Property", 'String'>
    readonly images: FieldRef<"Property", 'String'>
    readonly presentations: FieldRef<"Property", 'String'>
    readonly nearbyPlaces: FieldRef<"Property", 'String'>
    readonly dynamicFeatures: FieldRef<"Property", 'String'>
    readonly independentUnit: FieldRef<"Property", 'String'>
    readonly createdAt: FieldRef<"Property", 'DateTime'>
    readonly updatedAt: FieldRef<"Property", 'DateTime'>
    readonly ownerName: FieldRef<"Property", 'String'>
    readonly ownerPhone: FieldRef<"Property", 'String'>
    readonly ownerEmail: FieldRef<"Property", 'String'>
    readonly ownerNotes: FieldRef<"Property", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Property findUnique
   */
  export type PropertyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property findUniqueOrThrow
   */
  export type PropertyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property findFirst
   */
  export type PropertyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Properties.
     */
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property findFirstOrThrow
   */
  export type PropertyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Properties.
     */
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property findMany
   */
  export type PropertyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Properties to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property create
   */
  export type PropertyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The data needed to create a Property.
     */
    data: XOR<PropertyCreateInput, PropertyUncheckedCreateInput>
  }

  /**
   * Property createMany
   */
  export type PropertyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Properties.
     */
    data: PropertyCreateManyInput | PropertyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Property createManyAndReturn
   */
  export type PropertyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * The data used to create many Properties.
     */
    data: PropertyCreateManyInput | PropertyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Property update
   */
  export type PropertyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The data needed to update a Property.
     */
    data: XOR<PropertyUpdateInput, PropertyUncheckedUpdateInput>
    /**
     * Choose, which Property to update.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property updateMany
   */
  export type PropertyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Properties.
     */
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyInput>
    /**
     * Filter which Properties to update
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to update.
     */
    limit?: number
  }

  /**
   * Property updateManyAndReturn
   */
  export type PropertyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * The data used to update Properties.
     */
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyInput>
    /**
     * Filter which Properties to update
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to update.
     */
    limit?: number
  }

  /**
   * Property upsert
   */
  export type PropertyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The filter to search for the Property to update in case it exists.
     */
    where: PropertyWhereUniqueInput
    /**
     * In case the Property found by the `where` argument doesn't exist, create a new Property with this data.
     */
    create: XOR<PropertyCreateInput, PropertyUncheckedCreateInput>
    /**
     * In case the Property was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PropertyUpdateInput, PropertyUncheckedUpdateInput>
  }

  /**
   * Property delete
   */
  export type PropertyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter which Property to delete.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property deleteMany
   */
  export type PropertyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Properties to delete
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to delete.
     */
    limit?: number
  }

  /**
   * Property.leads
   */
  export type Property$leadsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    where?: LeadWhereInput
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    cursor?: LeadWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Property without action
   */
  export type PropertyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
  }


  /**
   * Model Lead
   */

  export type AggregateLead = {
    _count: LeadCountAggregateOutputType | null
    _avg: LeadAvgAggregateOutputType | null
    _sum: LeadSumAggregateOutputType | null
    _min: LeadMinAggregateOutputType | null
    _max: LeadMaxAggregateOutputType | null
  }

  export type LeadAvgAggregateOutputType = {
    budget: Decimal | null
  }

  export type LeadSumAggregateOutputType = {
    budget: Decimal | null
  }

  export type LeadMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    status: string | null
    budget: Decimal | null
    notes: string | null
    source: string | null
    preferences: string | null
    requiresMortgage: boolean | null
    agentId: string | null
    propertyId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LeadMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    status: string | null
    budget: Decimal | null
    notes: string | null
    source: string | null
    preferences: string | null
    requiresMortgage: boolean | null
    agentId: string | null
    propertyId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LeadCountAggregateOutputType = {
    id: number
    name: number
    email: number
    phone: number
    status: number
    budget: number
    notes: number
    source: number
    preferences: number
    requiresMortgage: number
    agentId: number
    propertyId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LeadAvgAggregateInputType = {
    budget?: true
  }

  export type LeadSumAggregateInputType = {
    budget?: true
  }

  export type LeadMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    status?: true
    budget?: true
    notes?: true
    source?: true
    preferences?: true
    requiresMortgage?: true
    agentId?: true
    propertyId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LeadMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    status?: true
    budget?: true
    notes?: true
    source?: true
    preferences?: true
    requiresMortgage?: true
    agentId?: true
    propertyId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LeadCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    status?: true
    budget?: true
    notes?: true
    source?: true
    preferences?: true
    requiresMortgage?: true
    agentId?: true
    propertyId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LeadAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lead to aggregate.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Leads
    **/
    _count?: true | LeadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LeadAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LeadSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LeadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LeadMaxAggregateInputType
  }

  export type GetLeadAggregateType<T extends LeadAggregateArgs> = {
        [P in keyof T & keyof AggregateLead]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLead[P]>
      : GetScalarType<T[P], AggregateLead[P]>
  }




  export type LeadGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeadWhereInput
    orderBy?: LeadOrderByWithAggregationInput | LeadOrderByWithAggregationInput[]
    by: LeadScalarFieldEnum[] | LeadScalarFieldEnum
    having?: LeadScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LeadCountAggregateInputType | true
    _avg?: LeadAvgAggregateInputType
    _sum?: LeadSumAggregateInputType
    _min?: LeadMinAggregateInputType
    _max?: LeadMaxAggregateInputType
  }

  export type LeadGroupByOutputType = {
    id: string
    name: string
    email: string | null
    phone: string
    status: string
    budget: Decimal | null
    notes: string | null
    source: string | null
    preferences: string | null
    requiresMortgage: boolean
    agentId: string | null
    propertyId: string | null
    createdAt: Date
    updatedAt: Date
    _count: LeadCountAggregateOutputType | null
    _avg: LeadAvgAggregateOutputType | null
    _sum: LeadSumAggregateOutputType | null
    _min: LeadMinAggregateOutputType | null
    _max: LeadMaxAggregateOutputType | null
  }

  type GetLeadGroupByPayload<T extends LeadGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LeadGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LeadGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LeadGroupByOutputType[P]>
            : GetScalarType<T[P], LeadGroupByOutputType[P]>
        }
      >
    >


  export type LeadSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    status?: boolean
    budget?: boolean
    notes?: boolean
    source?: boolean
    preferences?: boolean
    requiresMortgage?: boolean
    agentId?: boolean
    propertyId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agent?: boolean | Lead$agentArgs<ExtArgs>
    property?: boolean | Lead$propertyArgs<ExtArgs>
    calls?: boolean | Lead$callsArgs<ExtArgs>
    tasks?: boolean | Lead$tasksArgs<ExtArgs>
    appointments?: boolean | Lead$appointmentsArgs<ExtArgs>
    messages?: boolean | Lead$messagesArgs<ExtArgs>
    _count?: boolean | LeadCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lead"]>

  export type LeadSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    status?: boolean
    budget?: boolean
    notes?: boolean
    source?: boolean
    preferences?: boolean
    requiresMortgage?: boolean
    agentId?: boolean
    propertyId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agent?: boolean | Lead$agentArgs<ExtArgs>
    property?: boolean | Lead$propertyArgs<ExtArgs>
  }, ExtArgs["result"]["lead"]>

  export type LeadSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    status?: boolean
    budget?: boolean
    notes?: boolean
    source?: boolean
    preferences?: boolean
    requiresMortgage?: boolean
    agentId?: boolean
    propertyId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agent?: boolean | Lead$agentArgs<ExtArgs>
    property?: boolean | Lead$propertyArgs<ExtArgs>
  }, ExtArgs["result"]["lead"]>

  export type LeadSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    status?: boolean
    budget?: boolean
    notes?: boolean
    source?: boolean
    preferences?: boolean
    requiresMortgage?: boolean
    agentId?: boolean
    propertyId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LeadOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "phone" | "status" | "budget" | "notes" | "source" | "preferences" | "requiresMortgage" | "agentId" | "propertyId" | "createdAt" | "updatedAt", ExtArgs["result"]["lead"]>
  export type LeadInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | Lead$agentArgs<ExtArgs>
    property?: boolean | Lead$propertyArgs<ExtArgs>
    calls?: boolean | Lead$callsArgs<ExtArgs>
    tasks?: boolean | Lead$tasksArgs<ExtArgs>
    appointments?: boolean | Lead$appointmentsArgs<ExtArgs>
    messages?: boolean | Lead$messagesArgs<ExtArgs>
    _count?: boolean | LeadCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LeadIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | Lead$agentArgs<ExtArgs>
    property?: boolean | Lead$propertyArgs<ExtArgs>
  }
  export type LeadIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | Lead$agentArgs<ExtArgs>
    property?: boolean | Lead$propertyArgs<ExtArgs>
  }

  export type $LeadPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lead"
    objects: {
      agent: Prisma.$UserPayload<ExtArgs> | null
      property: Prisma.$PropertyPayload<ExtArgs> | null
      calls: Prisma.$CallPayload<ExtArgs>[]
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string | null
      phone: string
      status: string
      budget: Prisma.Decimal | null
      notes: string | null
      source: string | null
      preferences: string | null
      requiresMortgage: boolean
      agentId: string | null
      propertyId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["lead"]>
    composites: {}
  }

  type LeadGetPayload<S extends boolean | null | undefined | LeadDefaultArgs> = $Result.GetResult<Prisma.$LeadPayload, S>

  type LeadCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LeadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LeadCountAggregateInputType | true
    }

  export interface LeadDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lead'], meta: { name: 'Lead' } }
    /**
     * Find zero or one Lead that matches the filter.
     * @param {LeadFindUniqueArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeadFindUniqueArgs>(args: SelectSubset<T, LeadFindUniqueArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lead that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LeadFindUniqueOrThrowArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeadFindUniqueOrThrowArgs>(args: SelectSubset<T, LeadFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lead that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindFirstArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeadFindFirstArgs>(args?: SelectSubset<T, LeadFindFirstArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lead that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindFirstOrThrowArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeadFindFirstOrThrowArgs>(args?: SelectSubset<T, LeadFindFirstOrThrowArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Leads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Leads
     * const leads = await prisma.lead.findMany()
     * 
     * // Get first 10 Leads
     * const leads = await prisma.lead.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const leadWithIdOnly = await prisma.lead.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LeadFindManyArgs>(args?: SelectSubset<T, LeadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lead.
     * @param {LeadCreateArgs} args - Arguments to create a Lead.
     * @example
     * // Create one Lead
     * const Lead = await prisma.lead.create({
     *   data: {
     *     // ... data to create a Lead
     *   }
     * })
     * 
     */
    create<T extends LeadCreateArgs>(args: SelectSubset<T, LeadCreateArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Leads.
     * @param {LeadCreateManyArgs} args - Arguments to create many Leads.
     * @example
     * // Create many Leads
     * const lead = await prisma.lead.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LeadCreateManyArgs>(args?: SelectSubset<T, LeadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Leads and returns the data saved in the database.
     * @param {LeadCreateManyAndReturnArgs} args - Arguments to create many Leads.
     * @example
     * // Create many Leads
     * const lead = await prisma.lead.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Leads and only return the `id`
     * const leadWithIdOnly = await prisma.lead.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LeadCreateManyAndReturnArgs>(args?: SelectSubset<T, LeadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lead.
     * @param {LeadDeleteArgs} args - Arguments to delete one Lead.
     * @example
     * // Delete one Lead
     * const Lead = await prisma.lead.delete({
     *   where: {
     *     // ... filter to delete one Lead
     *   }
     * })
     * 
     */
    delete<T extends LeadDeleteArgs>(args: SelectSubset<T, LeadDeleteArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lead.
     * @param {LeadUpdateArgs} args - Arguments to update one Lead.
     * @example
     * // Update one Lead
     * const lead = await prisma.lead.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LeadUpdateArgs>(args: SelectSubset<T, LeadUpdateArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Leads.
     * @param {LeadDeleteManyArgs} args - Arguments to filter Leads to delete.
     * @example
     * // Delete a few Leads
     * const { count } = await prisma.lead.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LeadDeleteManyArgs>(args?: SelectSubset<T, LeadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Leads
     * const lead = await prisma.lead.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LeadUpdateManyArgs>(args: SelectSubset<T, LeadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leads and returns the data updated in the database.
     * @param {LeadUpdateManyAndReturnArgs} args - Arguments to update many Leads.
     * @example
     * // Update many Leads
     * const lead = await prisma.lead.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Leads and only return the `id`
     * const leadWithIdOnly = await prisma.lead.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LeadUpdateManyAndReturnArgs>(args: SelectSubset<T, LeadUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lead.
     * @param {LeadUpsertArgs} args - Arguments to update or create a Lead.
     * @example
     * // Update or create a Lead
     * const lead = await prisma.lead.upsert({
     *   create: {
     *     // ... data to create a Lead
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lead we want to update
     *   }
     * })
     */
    upsert<T extends LeadUpsertArgs>(args: SelectSubset<T, LeadUpsertArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Leads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadCountArgs} args - Arguments to filter Leads to count.
     * @example
     * // Count the number of Leads
     * const count = await prisma.lead.count({
     *   where: {
     *     // ... the filter for the Leads we want to count
     *   }
     * })
    **/
    count<T extends LeadCountArgs>(
      args?: Subset<T, LeadCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LeadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lead.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LeadAggregateArgs>(args: Subset<T, LeadAggregateArgs>): Prisma.PrismaPromise<GetLeadAggregateType<T>>

    /**
     * Group by Lead.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LeadGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LeadGroupByArgs['orderBy'] }
        : { orderBy?: LeadGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LeadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lead model
   */
  readonly fields: LeadFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lead.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LeadClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    agent<T extends Lead$agentArgs<ExtArgs> = {}>(args?: Subset<T, Lead$agentArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    property<T extends Lead$propertyArgs<ExtArgs> = {}>(args?: Subset<T, Lead$propertyArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    calls<T extends Lead$callsArgs<ExtArgs> = {}>(args?: Subset<T, Lead$callsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tasks<T extends Lead$tasksArgs<ExtArgs> = {}>(args?: Subset<T, Lead$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    appointments<T extends Lead$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Lead$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends Lead$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Lead$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Lead model
   */
  interface LeadFieldRefs {
    readonly id: FieldRef<"Lead", 'String'>
    readonly name: FieldRef<"Lead", 'String'>
    readonly email: FieldRef<"Lead", 'String'>
    readonly phone: FieldRef<"Lead", 'String'>
    readonly status: FieldRef<"Lead", 'String'>
    readonly budget: FieldRef<"Lead", 'Decimal'>
    readonly notes: FieldRef<"Lead", 'String'>
    readonly source: FieldRef<"Lead", 'String'>
    readonly preferences: FieldRef<"Lead", 'String'>
    readonly requiresMortgage: FieldRef<"Lead", 'Boolean'>
    readonly agentId: FieldRef<"Lead", 'String'>
    readonly propertyId: FieldRef<"Lead", 'String'>
    readonly createdAt: FieldRef<"Lead", 'DateTime'>
    readonly updatedAt: FieldRef<"Lead", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Lead findUnique
   */
  export type LeadFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead findUniqueOrThrow
   */
  export type LeadFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead findFirst
   */
  export type LeadFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leads.
     */
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead findFirstOrThrow
   */
  export type LeadFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leads.
     */
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead findMany
   */
  export type LeadFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Leads to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead create
   */
  export type LeadCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * The data needed to create a Lead.
     */
    data: XOR<LeadCreateInput, LeadUncheckedCreateInput>
  }

  /**
   * Lead createMany
   */
  export type LeadCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Leads.
     */
    data: LeadCreateManyInput | LeadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lead createManyAndReturn
   */
  export type LeadCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * The data used to create many Leads.
     */
    data: LeadCreateManyInput | LeadCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lead update
   */
  export type LeadUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * The data needed to update a Lead.
     */
    data: XOR<LeadUpdateInput, LeadUncheckedUpdateInput>
    /**
     * Choose, which Lead to update.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead updateMany
   */
  export type LeadUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Leads.
     */
    data: XOR<LeadUpdateManyMutationInput, LeadUncheckedUpdateManyInput>
    /**
     * Filter which Leads to update
     */
    where?: LeadWhereInput
    /**
     * Limit how many Leads to update.
     */
    limit?: number
  }

  /**
   * Lead updateManyAndReturn
   */
  export type LeadUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * The data used to update Leads.
     */
    data: XOR<LeadUpdateManyMutationInput, LeadUncheckedUpdateManyInput>
    /**
     * Filter which Leads to update
     */
    where?: LeadWhereInput
    /**
     * Limit how many Leads to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lead upsert
   */
  export type LeadUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * The filter to search for the Lead to update in case it exists.
     */
    where: LeadWhereUniqueInput
    /**
     * In case the Lead found by the `where` argument doesn't exist, create a new Lead with this data.
     */
    create: XOR<LeadCreateInput, LeadUncheckedCreateInput>
    /**
     * In case the Lead was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LeadUpdateInput, LeadUncheckedUpdateInput>
  }

  /**
   * Lead delete
   */
  export type LeadDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter which Lead to delete.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead deleteMany
   */
  export type LeadDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Leads to delete
     */
    where?: LeadWhereInput
    /**
     * Limit how many Leads to delete.
     */
    limit?: number
  }

  /**
   * Lead.agent
   */
  export type Lead$agentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Lead.property
   */
  export type Lead$propertyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    where?: PropertyWhereInput
  }

  /**
   * Lead.calls
   */
  export type Lead$callsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    where?: CallWhereInput
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    cursor?: CallWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CallScalarFieldEnum | CallScalarFieldEnum[]
  }

  /**
   * Lead.tasks
   */
  export type Lead$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Lead.appointments
   */
  export type Lead$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Lead.messages
   */
  export type Lead$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Lead without action
   */
  export type LeadDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
  }


  /**
   * Model Appointment
   */

  export type AggregateAppointment = {
    _count: AppointmentCountAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  export type AppointmentMinAggregateOutputType = {
    id: string | null
    title: string | null
    date: Date | null
    status: string | null
    leadId: string | null
    agentId: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppointmentMaxAggregateOutputType = {
    id: string | null
    title: string | null
    date: Date | null
    status: string | null
    leadId: string | null
    agentId: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppointmentCountAggregateOutputType = {
    id: number
    title: number
    date: number
    status: number
    leadId: number
    agentId: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AppointmentMinAggregateInputType = {
    id?: true
    title?: true
    date?: true
    status?: true
    leadId?: true
    agentId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppointmentMaxAggregateInputType = {
    id?: true
    title?: true
    date?: true
    status?: true
    leadId?: true
    agentId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppointmentCountAggregateInputType = {
    id?: true
    title?: true
    date?: true
    status?: true
    leadId?: true
    agentId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AppointmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointment to aggregate.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Appointments
    **/
    _count?: true | AppointmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppointmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppointmentMaxAggregateInputType
  }

  export type GetAppointmentAggregateType<T extends AppointmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAppointment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppointment[P]>
      : GetScalarType<T[P], AggregateAppointment[P]>
  }




  export type AppointmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithAggregationInput | AppointmentOrderByWithAggregationInput[]
    by: AppointmentScalarFieldEnum[] | AppointmentScalarFieldEnum
    having?: AppointmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppointmentCountAggregateInputType | true
    _min?: AppointmentMinAggregateInputType
    _max?: AppointmentMaxAggregateInputType
  }

  export type AppointmentGroupByOutputType = {
    id: string
    title: string
    date: Date
    status: string
    leadId: string
    agentId: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: AppointmentCountAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  type GetAppointmentGroupByPayload<T extends AppointmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppointmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppointmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
            : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
        }
      >
    >


  export type AppointmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    date?: boolean
    status?: boolean
    leadId?: boolean
    agentId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
    agent?: boolean | Appointment$agentArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    date?: boolean
    status?: boolean
    leadId?: boolean
    agentId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
    agent?: boolean | Appointment$agentArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    date?: boolean
    status?: boolean
    leadId?: boolean
    agentId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
    agent?: boolean | Appointment$agentArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectScalar = {
    id?: boolean
    title?: boolean
    date?: boolean
    status?: boolean
    leadId?: boolean
    agentId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AppointmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "date" | "status" | "leadId" | "agentId" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["appointment"]>
  export type AppointmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
    agent?: boolean | Appointment$agentArgs<ExtArgs>
  }
  export type AppointmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
    agent?: boolean | Appointment$agentArgs<ExtArgs>
  }
  export type AppointmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
    agent?: boolean | Appointment$agentArgs<ExtArgs>
  }

  export type $AppointmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Appointment"
    objects: {
      lead: Prisma.$LeadPayload<ExtArgs>
      agent: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      date: Date
      status: string
      leadId: string
      agentId: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["appointment"]>
    composites: {}
  }

  type AppointmentGetPayload<S extends boolean | null | undefined | AppointmentDefaultArgs> = $Result.GetResult<Prisma.$AppointmentPayload, S>

  type AppointmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AppointmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AppointmentCountAggregateInputType | true
    }

  export interface AppointmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Appointment'], meta: { name: 'Appointment' } }
    /**
     * Find zero or one Appointment that matches the filter.
     * @param {AppointmentFindUniqueArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppointmentFindUniqueArgs>(args: SelectSubset<T, AppointmentFindUniqueArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Appointment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AppointmentFindUniqueOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppointmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AppointmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Appointment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppointmentFindFirstArgs>(args?: SelectSubset<T, AppointmentFindFirstArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Appointment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppointmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AppointmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Appointments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Appointments
     * const appointments = await prisma.appointment.findMany()
     * 
     * // Get first 10 Appointments
     * const appointments = await prisma.appointment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appointmentWithIdOnly = await prisma.appointment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppointmentFindManyArgs>(args?: SelectSubset<T, AppointmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Appointment.
     * @param {AppointmentCreateArgs} args - Arguments to create a Appointment.
     * @example
     * // Create one Appointment
     * const Appointment = await prisma.appointment.create({
     *   data: {
     *     // ... data to create a Appointment
     *   }
     * })
     * 
     */
    create<T extends AppointmentCreateArgs>(args: SelectSubset<T, AppointmentCreateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Appointments.
     * @param {AppointmentCreateManyArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppointmentCreateManyArgs>(args?: SelectSubset<T, AppointmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Appointments and returns the data saved in the database.
     * @param {AppointmentCreateManyAndReturnArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Appointments and only return the `id`
     * const appointmentWithIdOnly = await prisma.appointment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppointmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AppointmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Appointment.
     * @param {AppointmentDeleteArgs} args - Arguments to delete one Appointment.
     * @example
     * // Delete one Appointment
     * const Appointment = await prisma.appointment.delete({
     *   where: {
     *     // ... filter to delete one Appointment
     *   }
     * })
     * 
     */
    delete<T extends AppointmentDeleteArgs>(args: SelectSubset<T, AppointmentDeleteArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Appointment.
     * @param {AppointmentUpdateArgs} args - Arguments to update one Appointment.
     * @example
     * // Update one Appointment
     * const appointment = await prisma.appointment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppointmentUpdateArgs>(args: SelectSubset<T, AppointmentUpdateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Appointments.
     * @param {AppointmentDeleteManyArgs} args - Arguments to filter Appointments to delete.
     * @example
     * // Delete a few Appointments
     * const { count } = await prisma.appointment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppointmentDeleteManyArgs>(args?: SelectSubset<T, AppointmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Appointments
     * const appointment = await prisma.appointment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppointmentUpdateManyArgs>(args: SelectSubset<T, AppointmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments and returns the data updated in the database.
     * @param {AppointmentUpdateManyAndReturnArgs} args - Arguments to update many Appointments.
     * @example
     * // Update many Appointments
     * const appointment = await prisma.appointment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Appointments and only return the `id`
     * const appointmentWithIdOnly = await prisma.appointment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AppointmentUpdateManyAndReturnArgs>(args: SelectSubset<T, AppointmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Appointment.
     * @param {AppointmentUpsertArgs} args - Arguments to update or create a Appointment.
     * @example
     * // Update or create a Appointment
     * const appointment = await prisma.appointment.upsert({
     *   create: {
     *     // ... data to create a Appointment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Appointment we want to update
     *   }
     * })
     */
    upsert<T extends AppointmentUpsertArgs>(args: SelectSubset<T, AppointmentUpsertArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentCountArgs} args - Arguments to filter Appointments to count.
     * @example
     * // Count the number of Appointments
     * const count = await prisma.appointment.count({
     *   where: {
     *     // ... the filter for the Appointments we want to count
     *   }
     * })
    **/
    count<T extends AppointmentCountArgs>(
      args?: Subset<T, AppointmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppointmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AppointmentAggregateArgs>(args: Subset<T, AppointmentAggregateArgs>): Prisma.PrismaPromise<GetAppointmentAggregateType<T>>

    /**
     * Group by Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AppointmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppointmentGroupByArgs['orderBy'] }
        : { orderBy?: AppointmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AppointmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppointmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Appointment model
   */
  readonly fields: AppointmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Appointment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppointmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lead<T extends LeadDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LeadDefaultArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    agent<T extends Appointment$agentArgs<ExtArgs> = {}>(args?: Subset<T, Appointment$agentArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Appointment model
   */
  interface AppointmentFieldRefs {
    readonly id: FieldRef<"Appointment", 'String'>
    readonly title: FieldRef<"Appointment", 'String'>
    readonly date: FieldRef<"Appointment", 'DateTime'>
    readonly status: FieldRef<"Appointment", 'String'>
    readonly leadId: FieldRef<"Appointment", 'String'>
    readonly agentId: FieldRef<"Appointment", 'String'>
    readonly notes: FieldRef<"Appointment", 'String'>
    readonly createdAt: FieldRef<"Appointment", 'DateTime'>
    readonly updatedAt: FieldRef<"Appointment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Appointment findUnique
   */
  export type AppointmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findUniqueOrThrow
   */
  export type AppointmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findFirst
   */
  export type AppointmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findFirstOrThrow
   */
  export type AppointmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findMany
   */
  export type AppointmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointments to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment create
   */
  export type AppointmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Appointment.
     */
    data: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
  }

  /**
   * Appointment createMany
   */
  export type AppointmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Appointment createManyAndReturn
   */
  export type AppointmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Appointment update
   */
  export type AppointmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Appointment.
     */
    data: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
    /**
     * Choose, which Appointment to update.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment updateMany
   */
  export type AppointmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Appointments.
     */
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyInput>
    /**
     * Filter which Appointments to update
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to update.
     */
    limit?: number
  }

  /**
   * Appointment updateManyAndReturn
   */
  export type AppointmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * The data used to update Appointments.
     */
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyInput>
    /**
     * Filter which Appointments to update
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Appointment upsert
   */
  export type AppointmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Appointment to update in case it exists.
     */
    where: AppointmentWhereUniqueInput
    /**
     * In case the Appointment found by the `where` argument doesn't exist, create a new Appointment with this data.
     */
    create: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
    /**
     * In case the Appointment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
  }

  /**
   * Appointment delete
   */
  export type AppointmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter which Appointment to delete.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment deleteMany
   */
  export type AppointmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointments to delete
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to delete.
     */
    limit?: number
  }

  /**
   * Appointment.agent
   */
  export type Appointment$agentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Appointment without action
   */
  export type AppointmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    content: string | null
    fromBot: boolean | null
    leadId: string | null
    createdAt: Date | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    content: string | null
    fromBot: boolean | null
    leadId: string | null
    createdAt: Date | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    content: number
    fromBot: number
    leadId: number
    createdAt: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    id?: true
    content?: true
    fromBot?: true
    leadId?: true
    createdAt?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    content?: true
    fromBot?: true
    leadId?: true
    createdAt?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    content?: true
    fromBot?: true
    leadId?: true
    createdAt?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    content: string
    fromBot: boolean
    leadId: string
    createdAt: Date
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    fromBot?: boolean
    leadId?: boolean
    createdAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    fromBot?: boolean
    leadId?: boolean
    createdAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    fromBot?: boolean
    leadId?: boolean
    createdAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    content?: boolean
    fromBot?: boolean
    leadId?: boolean
    createdAt?: boolean
  }

  export type MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "fromBot" | "leadId" | "createdAt", ExtArgs["result"]["message"]>
  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }
  export type MessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      lead: Prisma.$LeadPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      fromBot: boolean
      leadId: string
      createdAt: Date
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {MessageUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(args: SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lead<T extends LeadDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LeadDefaultArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly content: FieldRef<"Message", 'String'>
    readonly fromBot: FieldRef<"Message", 'Boolean'>
    readonly leadId: FieldRef<"Message", 'String'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
  }

  /**
   * Message updateManyAndReturn
   */
  export type MessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to delete.
     */
    limit?: number
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Model Call
   */

  export type AggregateCall = {
    _count: CallCountAggregateOutputType | null
    _avg: CallAvgAggregateOutputType | null
    _sum: CallSumAggregateOutputType | null
    _min: CallMinAggregateOutputType | null
    _max: CallMaxAggregateOutputType | null
  }

  export type CallAvgAggregateOutputType = {
    duration: number | null
  }

  export type CallSumAggregateOutputType = {
    duration: number | null
  }

  export type CallMinAggregateOutputType = {
    id: string | null
    leadId: string | null
    duration: number | null
    audioUrl: string | null
    transcription: string | null
    summary: string | null
    mainTopic: string | null
    keyPoints: string | null
    commitments: string | null
    sentiment: string | null
    createdAt: Date | null
  }

  export type CallMaxAggregateOutputType = {
    id: string | null
    leadId: string | null
    duration: number | null
    audioUrl: string | null
    transcription: string | null
    summary: string | null
    mainTopic: string | null
    keyPoints: string | null
    commitments: string | null
    sentiment: string | null
    createdAt: Date | null
  }

  export type CallCountAggregateOutputType = {
    id: number
    leadId: number
    duration: number
    audioUrl: number
    transcription: number
    summary: number
    mainTopic: number
    keyPoints: number
    commitments: number
    sentiment: number
    createdAt: number
    _all: number
  }


  export type CallAvgAggregateInputType = {
    duration?: true
  }

  export type CallSumAggregateInputType = {
    duration?: true
  }

  export type CallMinAggregateInputType = {
    id?: true
    leadId?: true
    duration?: true
    audioUrl?: true
    transcription?: true
    summary?: true
    mainTopic?: true
    keyPoints?: true
    commitments?: true
    sentiment?: true
    createdAt?: true
  }

  export type CallMaxAggregateInputType = {
    id?: true
    leadId?: true
    duration?: true
    audioUrl?: true
    transcription?: true
    summary?: true
    mainTopic?: true
    keyPoints?: true
    commitments?: true
    sentiment?: true
    createdAt?: true
  }

  export type CallCountAggregateInputType = {
    id?: true
    leadId?: true
    duration?: true
    audioUrl?: true
    transcription?: true
    summary?: true
    mainTopic?: true
    keyPoints?: true
    commitments?: true
    sentiment?: true
    createdAt?: true
    _all?: true
  }

  export type CallAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Call to aggregate.
     */
    where?: CallWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calls to fetch.
     */
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CallWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Calls
    **/
    _count?: true | CallCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CallAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CallSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CallMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CallMaxAggregateInputType
  }

  export type GetCallAggregateType<T extends CallAggregateArgs> = {
        [P in keyof T & keyof AggregateCall]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCall[P]>
      : GetScalarType<T[P], AggregateCall[P]>
  }




  export type CallGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CallWhereInput
    orderBy?: CallOrderByWithAggregationInput | CallOrderByWithAggregationInput[]
    by: CallScalarFieldEnum[] | CallScalarFieldEnum
    having?: CallScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CallCountAggregateInputType | true
    _avg?: CallAvgAggregateInputType
    _sum?: CallSumAggregateInputType
    _min?: CallMinAggregateInputType
    _max?: CallMaxAggregateInputType
  }

  export type CallGroupByOutputType = {
    id: string
    leadId: string
    duration: number
    audioUrl: string | null
    transcription: string | null
    summary: string | null
    mainTopic: string | null
    keyPoints: string | null
    commitments: string | null
    sentiment: string | null
    createdAt: Date
    _count: CallCountAggregateOutputType | null
    _avg: CallAvgAggregateOutputType | null
    _sum: CallSumAggregateOutputType | null
    _min: CallMinAggregateOutputType | null
    _max: CallMaxAggregateOutputType | null
  }

  type GetCallGroupByPayload<T extends CallGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CallGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CallGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CallGroupByOutputType[P]>
            : GetScalarType<T[P], CallGroupByOutputType[P]>
        }
      >
    >


  export type CallSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leadId?: boolean
    duration?: boolean
    audioUrl?: boolean
    transcription?: boolean
    summary?: boolean
    mainTopic?: boolean
    keyPoints?: boolean
    commitments?: boolean
    sentiment?: boolean
    createdAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["call"]>

  export type CallSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leadId?: boolean
    duration?: boolean
    audioUrl?: boolean
    transcription?: boolean
    summary?: boolean
    mainTopic?: boolean
    keyPoints?: boolean
    commitments?: boolean
    sentiment?: boolean
    createdAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["call"]>

  export type CallSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leadId?: boolean
    duration?: boolean
    audioUrl?: boolean
    transcription?: boolean
    summary?: boolean
    mainTopic?: boolean
    keyPoints?: boolean
    commitments?: boolean
    sentiment?: boolean
    createdAt?: boolean
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["call"]>

  export type CallSelectScalar = {
    id?: boolean
    leadId?: boolean
    duration?: boolean
    audioUrl?: boolean
    transcription?: boolean
    summary?: boolean
    mainTopic?: boolean
    keyPoints?: boolean
    commitments?: boolean
    sentiment?: boolean
    createdAt?: boolean
  }

  export type CallOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "leadId" | "duration" | "audioUrl" | "transcription" | "summary" | "mainTopic" | "keyPoints" | "commitments" | "sentiment" | "createdAt", ExtArgs["result"]["call"]>
  export type CallInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }
  export type CallIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }
  export type CallIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lead?: boolean | LeadDefaultArgs<ExtArgs>
  }

  export type $CallPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Call"
    objects: {
      lead: Prisma.$LeadPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      leadId: string
      duration: number
      audioUrl: string | null
      transcription: string | null
      summary: string | null
      mainTopic: string | null
      keyPoints: string | null
      commitments: string | null
      sentiment: string | null
      createdAt: Date
    }, ExtArgs["result"]["call"]>
    composites: {}
  }

  type CallGetPayload<S extends boolean | null | undefined | CallDefaultArgs> = $Result.GetResult<Prisma.$CallPayload, S>

  type CallCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CallFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CallCountAggregateInputType | true
    }

  export interface CallDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Call'], meta: { name: 'Call' } }
    /**
     * Find zero or one Call that matches the filter.
     * @param {CallFindUniqueArgs} args - Arguments to find a Call
     * @example
     * // Get one Call
     * const call = await prisma.call.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CallFindUniqueArgs>(args: SelectSubset<T, CallFindUniqueArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Call that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CallFindUniqueOrThrowArgs} args - Arguments to find a Call
     * @example
     * // Get one Call
     * const call = await prisma.call.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CallFindUniqueOrThrowArgs>(args: SelectSubset<T, CallFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Call that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallFindFirstArgs} args - Arguments to find a Call
     * @example
     * // Get one Call
     * const call = await prisma.call.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CallFindFirstArgs>(args?: SelectSubset<T, CallFindFirstArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Call that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallFindFirstOrThrowArgs} args - Arguments to find a Call
     * @example
     * // Get one Call
     * const call = await prisma.call.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CallFindFirstOrThrowArgs>(args?: SelectSubset<T, CallFindFirstOrThrowArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Calls that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Calls
     * const calls = await prisma.call.findMany()
     * 
     * // Get first 10 Calls
     * const calls = await prisma.call.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const callWithIdOnly = await prisma.call.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CallFindManyArgs>(args?: SelectSubset<T, CallFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Call.
     * @param {CallCreateArgs} args - Arguments to create a Call.
     * @example
     * // Create one Call
     * const Call = await prisma.call.create({
     *   data: {
     *     // ... data to create a Call
     *   }
     * })
     * 
     */
    create<T extends CallCreateArgs>(args: SelectSubset<T, CallCreateArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Calls.
     * @param {CallCreateManyArgs} args - Arguments to create many Calls.
     * @example
     * // Create many Calls
     * const call = await prisma.call.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CallCreateManyArgs>(args?: SelectSubset<T, CallCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Calls and returns the data saved in the database.
     * @param {CallCreateManyAndReturnArgs} args - Arguments to create many Calls.
     * @example
     * // Create many Calls
     * const call = await prisma.call.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Calls and only return the `id`
     * const callWithIdOnly = await prisma.call.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CallCreateManyAndReturnArgs>(args?: SelectSubset<T, CallCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Call.
     * @param {CallDeleteArgs} args - Arguments to delete one Call.
     * @example
     * // Delete one Call
     * const Call = await prisma.call.delete({
     *   where: {
     *     // ... filter to delete one Call
     *   }
     * })
     * 
     */
    delete<T extends CallDeleteArgs>(args: SelectSubset<T, CallDeleteArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Call.
     * @param {CallUpdateArgs} args - Arguments to update one Call.
     * @example
     * // Update one Call
     * const call = await prisma.call.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CallUpdateArgs>(args: SelectSubset<T, CallUpdateArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Calls.
     * @param {CallDeleteManyArgs} args - Arguments to filter Calls to delete.
     * @example
     * // Delete a few Calls
     * const { count } = await prisma.call.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CallDeleteManyArgs>(args?: SelectSubset<T, CallDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Calls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Calls
     * const call = await prisma.call.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CallUpdateManyArgs>(args: SelectSubset<T, CallUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Calls and returns the data updated in the database.
     * @param {CallUpdateManyAndReturnArgs} args - Arguments to update many Calls.
     * @example
     * // Update many Calls
     * const call = await prisma.call.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Calls and only return the `id`
     * const callWithIdOnly = await prisma.call.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CallUpdateManyAndReturnArgs>(args: SelectSubset<T, CallUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Call.
     * @param {CallUpsertArgs} args - Arguments to update or create a Call.
     * @example
     * // Update or create a Call
     * const call = await prisma.call.upsert({
     *   create: {
     *     // ... data to create a Call
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Call we want to update
     *   }
     * })
     */
    upsert<T extends CallUpsertArgs>(args: SelectSubset<T, CallUpsertArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Calls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallCountArgs} args - Arguments to filter Calls to count.
     * @example
     * // Count the number of Calls
     * const count = await prisma.call.count({
     *   where: {
     *     // ... the filter for the Calls we want to count
     *   }
     * })
    **/
    count<T extends CallCountArgs>(
      args?: Subset<T, CallCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CallCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Call.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CallAggregateArgs>(args: Subset<T, CallAggregateArgs>): Prisma.PrismaPromise<GetCallAggregateType<T>>

    /**
     * Group by Call.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CallGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CallGroupByArgs['orderBy'] }
        : { orderBy?: CallGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CallGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCallGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Call model
   */
  readonly fields: CallFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Call.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CallClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lead<T extends LeadDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LeadDefaultArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Call model
   */
  interface CallFieldRefs {
    readonly id: FieldRef<"Call", 'String'>
    readonly leadId: FieldRef<"Call", 'String'>
    readonly duration: FieldRef<"Call", 'Int'>
    readonly audioUrl: FieldRef<"Call", 'String'>
    readonly transcription: FieldRef<"Call", 'String'>
    readonly summary: FieldRef<"Call", 'String'>
    readonly mainTopic: FieldRef<"Call", 'String'>
    readonly keyPoints: FieldRef<"Call", 'String'>
    readonly commitments: FieldRef<"Call", 'String'>
    readonly sentiment: FieldRef<"Call", 'String'>
    readonly createdAt: FieldRef<"Call", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Call findUnique
   */
  export type CallFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Call to fetch.
     */
    where: CallWhereUniqueInput
  }

  /**
   * Call findUniqueOrThrow
   */
  export type CallFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Call to fetch.
     */
    where: CallWhereUniqueInput
  }

  /**
   * Call findFirst
   */
  export type CallFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Call to fetch.
     */
    where?: CallWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calls to fetch.
     */
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Calls.
     */
    cursor?: CallWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Calls.
     */
    distinct?: CallScalarFieldEnum | CallScalarFieldEnum[]
  }

  /**
   * Call findFirstOrThrow
   */
  export type CallFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Call to fetch.
     */
    where?: CallWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calls to fetch.
     */
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Calls.
     */
    cursor?: CallWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Calls.
     */
    distinct?: CallScalarFieldEnum | CallScalarFieldEnum[]
  }

  /**
   * Call findMany
   */
  export type CallFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Calls to fetch.
     */
    where?: CallWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calls to fetch.
     */
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Calls.
     */
    cursor?: CallWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calls.
     */
    skip?: number
    distinct?: CallScalarFieldEnum | CallScalarFieldEnum[]
  }

  /**
   * Call create
   */
  export type CallCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * The data needed to create a Call.
     */
    data: XOR<CallCreateInput, CallUncheckedCreateInput>
  }

  /**
   * Call createMany
   */
  export type CallCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Calls.
     */
    data: CallCreateManyInput | CallCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Call createManyAndReturn
   */
  export type CallCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * The data used to create many Calls.
     */
    data: CallCreateManyInput | CallCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Call update
   */
  export type CallUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * The data needed to update a Call.
     */
    data: XOR<CallUpdateInput, CallUncheckedUpdateInput>
    /**
     * Choose, which Call to update.
     */
    where: CallWhereUniqueInput
  }

  /**
   * Call updateMany
   */
  export type CallUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Calls.
     */
    data: XOR<CallUpdateManyMutationInput, CallUncheckedUpdateManyInput>
    /**
     * Filter which Calls to update
     */
    where?: CallWhereInput
    /**
     * Limit how many Calls to update.
     */
    limit?: number
  }

  /**
   * Call updateManyAndReturn
   */
  export type CallUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * The data used to update Calls.
     */
    data: XOR<CallUpdateManyMutationInput, CallUncheckedUpdateManyInput>
    /**
     * Filter which Calls to update
     */
    where?: CallWhereInput
    /**
     * Limit how many Calls to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Call upsert
   */
  export type CallUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * The filter to search for the Call to update in case it exists.
     */
    where: CallWhereUniqueInput
    /**
     * In case the Call found by the `where` argument doesn't exist, create a new Call with this data.
     */
    create: XOR<CallCreateInput, CallUncheckedCreateInput>
    /**
     * In case the Call was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CallUpdateInput, CallUncheckedUpdateInput>
  }

  /**
   * Call delete
   */
  export type CallDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter which Call to delete.
     */
    where: CallWhereUniqueInput
  }

  /**
   * Call deleteMany
   */
  export type CallDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Calls to delete
     */
    where?: CallWhereInput
    /**
     * Limit how many Calls to delete.
     */
    limit?: number
  }

  /**
   * Call without action
   */
  export type CallDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
  }


  /**
   * Model TaskList
   */

  export type AggregateTaskList = {
    _count: TaskListCountAggregateOutputType | null
    _min: TaskListMinAggregateOutputType | null
    _max: TaskListMaxAggregateOutputType | null
  }

  export type TaskListMinAggregateOutputType = {
    id: string | null
    name: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskListMaxAggregateOutputType = {
    id: string | null
    name: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskListCountAggregateOutputType = {
    id: number
    name: number
    color: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TaskListMinAggregateInputType = {
    id?: true
    name?: true
    color?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskListMaxAggregateInputType = {
    id?: true
    name?: true
    color?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskListCountAggregateInputType = {
    id?: true
    name?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TaskListAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskList to aggregate.
     */
    where?: TaskListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskLists to fetch.
     */
    orderBy?: TaskListOrderByWithRelationInput | TaskListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TaskLists
    **/
    _count?: true | TaskListCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskListMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskListMaxAggregateInputType
  }

  export type GetTaskListAggregateType<T extends TaskListAggregateArgs> = {
        [P in keyof T & keyof AggregateTaskList]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaskList[P]>
      : GetScalarType<T[P], AggregateTaskList[P]>
  }




  export type TaskListGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskListWhereInput
    orderBy?: TaskListOrderByWithAggregationInput | TaskListOrderByWithAggregationInput[]
    by: TaskListScalarFieldEnum[] | TaskListScalarFieldEnum
    having?: TaskListScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskListCountAggregateInputType | true
    _min?: TaskListMinAggregateInputType
    _max?: TaskListMaxAggregateInputType
  }

  export type TaskListGroupByOutputType = {
    id: string
    name: string
    color: string | null
    createdAt: Date
    updatedAt: Date
    _count: TaskListCountAggregateOutputType | null
    _min: TaskListMinAggregateOutputType | null
    _max: TaskListMaxAggregateOutputType | null
  }

  type GetTaskListGroupByPayload<T extends TaskListGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskListGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskListGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskListGroupByOutputType[P]>
            : GetScalarType<T[P], TaskListGroupByOutputType[P]>
        }
      >
    >


  export type TaskListSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tasks?: boolean | TaskList$tasksArgs<ExtArgs>
    _count?: boolean | TaskListCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskList"]>

  export type TaskListSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["taskList"]>

  export type TaskListSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["taskList"]>

  export type TaskListSelectScalar = {
    id?: boolean
    name?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TaskListOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "color" | "createdAt" | "updatedAt", ExtArgs["result"]["taskList"]>
  export type TaskListInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | TaskList$tasksArgs<ExtArgs>
    _count?: boolean | TaskListCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TaskListIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TaskListIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TaskListPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TaskList"
    objects: {
      tasks: Prisma.$TaskPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      color: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["taskList"]>
    composites: {}
  }

  type TaskListGetPayload<S extends boolean | null | undefined | TaskListDefaultArgs> = $Result.GetResult<Prisma.$TaskListPayload, S>

  type TaskListCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaskListFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskListCountAggregateInputType | true
    }

  export interface TaskListDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TaskList'], meta: { name: 'TaskList' } }
    /**
     * Find zero or one TaskList that matches the filter.
     * @param {TaskListFindUniqueArgs} args - Arguments to find a TaskList
     * @example
     * // Get one TaskList
     * const taskList = await prisma.taskList.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskListFindUniqueArgs>(args: SelectSubset<T, TaskListFindUniqueArgs<ExtArgs>>): Prisma__TaskListClient<$Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TaskList that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaskListFindUniqueOrThrowArgs} args - Arguments to find a TaskList
     * @example
     * // Get one TaskList
     * const taskList = await prisma.taskList.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskListFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskListFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskListClient<$Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaskList that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskListFindFirstArgs} args - Arguments to find a TaskList
     * @example
     * // Get one TaskList
     * const taskList = await prisma.taskList.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskListFindFirstArgs>(args?: SelectSubset<T, TaskListFindFirstArgs<ExtArgs>>): Prisma__TaskListClient<$Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaskList that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskListFindFirstOrThrowArgs} args - Arguments to find a TaskList
     * @example
     * // Get one TaskList
     * const taskList = await prisma.taskList.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskListFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskListFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskListClient<$Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TaskLists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskListFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaskLists
     * const taskLists = await prisma.taskList.findMany()
     * 
     * // Get first 10 TaskLists
     * const taskLists = await prisma.taskList.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskListWithIdOnly = await prisma.taskList.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskListFindManyArgs>(args?: SelectSubset<T, TaskListFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TaskList.
     * @param {TaskListCreateArgs} args - Arguments to create a TaskList.
     * @example
     * // Create one TaskList
     * const TaskList = await prisma.taskList.create({
     *   data: {
     *     // ... data to create a TaskList
     *   }
     * })
     * 
     */
    create<T extends TaskListCreateArgs>(args: SelectSubset<T, TaskListCreateArgs<ExtArgs>>): Prisma__TaskListClient<$Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TaskLists.
     * @param {TaskListCreateManyArgs} args - Arguments to create many TaskLists.
     * @example
     * // Create many TaskLists
     * const taskList = await prisma.taskList.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskListCreateManyArgs>(args?: SelectSubset<T, TaskListCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaskLists and returns the data saved in the database.
     * @param {TaskListCreateManyAndReturnArgs} args - Arguments to create many TaskLists.
     * @example
     * // Create many TaskLists
     * const taskList = await prisma.taskList.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TaskLists and only return the `id`
     * const taskListWithIdOnly = await prisma.taskList.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskListCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskListCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TaskList.
     * @param {TaskListDeleteArgs} args - Arguments to delete one TaskList.
     * @example
     * // Delete one TaskList
     * const TaskList = await prisma.taskList.delete({
     *   where: {
     *     // ... filter to delete one TaskList
     *   }
     * })
     * 
     */
    delete<T extends TaskListDeleteArgs>(args: SelectSubset<T, TaskListDeleteArgs<ExtArgs>>): Prisma__TaskListClient<$Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TaskList.
     * @param {TaskListUpdateArgs} args - Arguments to update one TaskList.
     * @example
     * // Update one TaskList
     * const taskList = await prisma.taskList.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskListUpdateArgs>(args: SelectSubset<T, TaskListUpdateArgs<ExtArgs>>): Prisma__TaskListClient<$Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TaskLists.
     * @param {TaskListDeleteManyArgs} args - Arguments to filter TaskLists to delete.
     * @example
     * // Delete a few TaskLists
     * const { count } = await prisma.taskList.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskListDeleteManyArgs>(args?: SelectSubset<T, TaskListDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskListUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaskLists
     * const taskList = await prisma.taskList.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskListUpdateManyArgs>(args: SelectSubset<T, TaskListUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskLists and returns the data updated in the database.
     * @param {TaskListUpdateManyAndReturnArgs} args - Arguments to update many TaskLists.
     * @example
     * // Update many TaskLists
     * const taskList = await prisma.taskList.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TaskLists and only return the `id`
     * const taskListWithIdOnly = await prisma.taskList.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TaskListUpdateManyAndReturnArgs>(args: SelectSubset<T, TaskListUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TaskList.
     * @param {TaskListUpsertArgs} args - Arguments to update or create a TaskList.
     * @example
     * // Update or create a TaskList
     * const taskList = await prisma.taskList.upsert({
     *   create: {
     *     // ... data to create a TaskList
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaskList we want to update
     *   }
     * })
     */
    upsert<T extends TaskListUpsertArgs>(args: SelectSubset<T, TaskListUpsertArgs<ExtArgs>>): Prisma__TaskListClient<$Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TaskLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskListCountArgs} args - Arguments to filter TaskLists to count.
     * @example
     * // Count the number of TaskLists
     * const count = await prisma.taskList.count({
     *   where: {
     *     // ... the filter for the TaskLists we want to count
     *   }
     * })
    **/
    count<T extends TaskListCountArgs>(
      args?: Subset<T, TaskListCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskListCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaskList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskListAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskListAggregateArgs>(args: Subset<T, TaskListAggregateArgs>): Prisma.PrismaPromise<GetTaskListAggregateType<T>>

    /**
     * Group by TaskList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskListGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskListGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskListGroupByArgs['orderBy'] }
        : { orderBy?: TaskListGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskListGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskListGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TaskList model
   */
  readonly fields: TaskListFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaskList.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskListClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tasks<T extends TaskList$tasksArgs<ExtArgs> = {}>(args?: Subset<T, TaskList$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TaskList model
   */
  interface TaskListFieldRefs {
    readonly id: FieldRef<"TaskList", 'String'>
    readonly name: FieldRef<"TaskList", 'String'>
    readonly color: FieldRef<"TaskList", 'String'>
    readonly createdAt: FieldRef<"TaskList", 'DateTime'>
    readonly updatedAt: FieldRef<"TaskList", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TaskList findUnique
   */
  export type TaskListFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskList
     */
    select?: TaskListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskList
     */
    omit?: TaskListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskListInclude<ExtArgs> | null
    /**
     * Filter, which TaskList to fetch.
     */
    where: TaskListWhereUniqueInput
  }

  /**
   * TaskList findUniqueOrThrow
   */
  export type TaskListFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskList
     */
    select?: TaskListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskList
     */
    omit?: TaskListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskListInclude<ExtArgs> | null
    /**
     * Filter, which TaskList to fetch.
     */
    where: TaskListWhereUniqueInput
  }

  /**
   * TaskList findFirst
   */
  export type TaskListFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskList
     */
    select?: TaskListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskList
     */
    omit?: TaskListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskListInclude<ExtArgs> | null
    /**
     * Filter, which TaskList to fetch.
     */
    where?: TaskListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskLists to fetch.
     */
    orderBy?: TaskListOrderByWithRelationInput | TaskListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskLists.
     */
    cursor?: TaskListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskLists.
     */
    distinct?: TaskListScalarFieldEnum | TaskListScalarFieldEnum[]
  }

  /**
   * TaskList findFirstOrThrow
   */
  export type TaskListFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskList
     */
    select?: TaskListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskList
     */
    omit?: TaskListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskListInclude<ExtArgs> | null
    /**
     * Filter, which TaskList to fetch.
     */
    where?: TaskListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskLists to fetch.
     */
    orderBy?: TaskListOrderByWithRelationInput | TaskListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskLists.
     */
    cursor?: TaskListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskLists.
     */
    distinct?: TaskListScalarFieldEnum | TaskListScalarFieldEnum[]
  }

  /**
   * TaskList findMany
   */
  export type TaskListFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskList
     */
    select?: TaskListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskList
     */
    omit?: TaskListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskListInclude<ExtArgs> | null
    /**
     * Filter, which TaskLists to fetch.
     */
    where?: TaskListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskLists to fetch.
     */
    orderBy?: TaskListOrderByWithRelationInput | TaskListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TaskLists.
     */
    cursor?: TaskListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskLists.
     */
    skip?: number
    distinct?: TaskListScalarFieldEnum | TaskListScalarFieldEnum[]
  }

  /**
   * TaskList create
   */
  export type TaskListCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskList
     */
    select?: TaskListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskList
     */
    omit?: TaskListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskListInclude<ExtArgs> | null
    /**
     * The data needed to create a TaskList.
     */
    data: XOR<TaskListCreateInput, TaskListUncheckedCreateInput>
  }

  /**
   * TaskList createMany
   */
  export type TaskListCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TaskLists.
     */
    data: TaskListCreateManyInput | TaskListCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaskList createManyAndReturn
   */
  export type TaskListCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskList
     */
    select?: TaskListSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskList
     */
    omit?: TaskListOmit<ExtArgs> | null
    /**
     * The data used to create many TaskLists.
     */
    data: TaskListCreateManyInput | TaskListCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaskList update
   */
  export type TaskListUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskList
     */
    select?: TaskListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskList
     */
    omit?: TaskListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskListInclude<ExtArgs> | null
    /**
     * The data needed to update a TaskList.
     */
    data: XOR<TaskListUpdateInput, TaskListUncheckedUpdateInput>
    /**
     * Choose, which TaskList to update.
     */
    where: TaskListWhereUniqueInput
  }

  /**
   * TaskList updateMany
   */
  export type TaskListUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TaskLists.
     */
    data: XOR<TaskListUpdateManyMutationInput, TaskListUncheckedUpdateManyInput>
    /**
     * Filter which TaskLists to update
     */
    where?: TaskListWhereInput
    /**
     * Limit how many TaskLists to update.
     */
    limit?: number
  }

  /**
   * TaskList updateManyAndReturn
   */
  export type TaskListUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskList
     */
    select?: TaskListSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskList
     */
    omit?: TaskListOmit<ExtArgs> | null
    /**
     * The data used to update TaskLists.
     */
    data: XOR<TaskListUpdateManyMutationInput, TaskListUncheckedUpdateManyInput>
    /**
     * Filter which TaskLists to update
     */
    where?: TaskListWhereInput
    /**
     * Limit how many TaskLists to update.
     */
    limit?: number
  }

  /**
   * TaskList upsert
   */
  export type TaskListUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskList
     */
    select?: TaskListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskList
     */
    omit?: TaskListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskListInclude<ExtArgs> | null
    /**
     * The filter to search for the TaskList to update in case it exists.
     */
    where: TaskListWhereUniqueInput
    /**
     * In case the TaskList found by the `where` argument doesn't exist, create a new TaskList with this data.
     */
    create: XOR<TaskListCreateInput, TaskListUncheckedCreateInput>
    /**
     * In case the TaskList was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskListUpdateInput, TaskListUncheckedUpdateInput>
  }

  /**
   * TaskList delete
   */
  export type TaskListDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskList
     */
    select?: TaskListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskList
     */
    omit?: TaskListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskListInclude<ExtArgs> | null
    /**
     * Filter which TaskList to delete.
     */
    where: TaskListWhereUniqueInput
  }

  /**
   * TaskList deleteMany
   */
  export type TaskListDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskLists to delete
     */
    where?: TaskListWhereInput
    /**
     * Limit how many TaskLists to delete.
     */
    limit?: number
  }

  /**
   * TaskList.tasks
   */
  export type TaskList$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * TaskList without action
   */
  export type TaskListDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskList
     */
    select?: TaskListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskList
     */
    omit?: TaskListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskListInclude<ExtArgs> | null
  }


  /**
   * Model Task
   */

  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    status: string | null
    isImportant: boolean | null
    dueDate: Date | null
    assignedTo: string | null
    listId: string | null
    leadId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    status: string | null
    isImportant: boolean | null
    dueDate: Date | null
    assignedTo: string | null
    listId: string | null
    leadId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    title: number
    description: number
    status: number
    isImportant: number
    dueDate: number
    assignedTo: number
    listId: number
    leadId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TaskMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    isImportant?: true
    dueDate?: true
    assignedTo?: true
    listId?: true
    leadId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    isImportant?: true
    dueDate?: true
    assignedTo?: true
    listId?: true
    leadId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    isImportant?: true
    dueDate?: true
    assignedTo?: true
    listId?: true
    leadId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Task to aggregate.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type TaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithAggregationInput | TaskOrderByWithAggregationInput[]
    by: TaskScalarFieldEnum[] | TaskScalarFieldEnum
    having?: TaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }

  export type TaskGroupByOutputType = {
    id: string
    title: string
    description: string | null
    status: string
    isImportant: boolean
    dueDate: Date | null
    assignedTo: string | null
    listId: string | null
    leadId: string | null
    createdAt: Date
    updatedAt: Date
    _count: TaskCountAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type TaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    isImportant?: boolean
    dueDate?: boolean
    assignedTo?: boolean
    listId?: boolean
    leadId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agent?: boolean | Task$agentArgs<ExtArgs>
    list?: boolean | Task$listArgs<ExtArgs>
    lead?: boolean | Task$leadArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    isImportant?: boolean
    dueDate?: boolean
    assignedTo?: boolean
    listId?: boolean
    leadId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agent?: boolean | Task$agentArgs<ExtArgs>
    list?: boolean | Task$listArgs<ExtArgs>
    lead?: boolean | Task$leadArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    isImportant?: boolean
    dueDate?: boolean
    assignedTo?: boolean
    listId?: boolean
    leadId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agent?: boolean | Task$agentArgs<ExtArgs>
    list?: boolean | Task$listArgs<ExtArgs>
    lead?: boolean | Task$leadArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    isImportant?: boolean
    dueDate?: boolean
    assignedTo?: boolean
    listId?: boolean
    leadId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TaskOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "status" | "isImportant" | "dueDate" | "assignedTo" | "listId" | "leadId" | "createdAt" | "updatedAt", ExtArgs["result"]["task"]>
  export type TaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | Task$agentArgs<ExtArgs>
    list?: boolean | Task$listArgs<ExtArgs>
    lead?: boolean | Task$leadArgs<ExtArgs>
  }
  export type TaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | Task$agentArgs<ExtArgs>
    list?: boolean | Task$listArgs<ExtArgs>
    lead?: boolean | Task$leadArgs<ExtArgs>
  }
  export type TaskIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | Task$agentArgs<ExtArgs>
    list?: boolean | Task$listArgs<ExtArgs>
    lead?: boolean | Task$leadArgs<ExtArgs>
  }

  export type $TaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Task"
    objects: {
      agent: Prisma.$UserPayload<ExtArgs> | null
      list: Prisma.$TaskListPayload<ExtArgs> | null
      lead: Prisma.$LeadPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      status: string
      isImportant: boolean
      dueDate: Date | null
      assignedTo: string | null
      listId: string | null
      leadId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["task"]>
    composites: {}
  }

  type TaskGetPayload<S extends boolean | null | undefined | TaskDefaultArgs> = $Result.GetResult<Prisma.$TaskPayload, S>

  type TaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface TaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Task'], meta: { name: 'Task' } }
    /**
     * Find zero or one Task that matches the filter.
     * @param {TaskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskFindUniqueArgs>(args: SelectSubset<T, TaskFindUniqueArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Task that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskFindFirstArgs>(args?: SelectSubset<T, TaskFindFirstArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Task that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskFindManyArgs>(args?: SelectSubset<T, TaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Task.
     * @param {TaskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
     */
    create<T extends TaskCreateArgs>(args: SelectSubset<T, TaskCreateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tasks.
     * @param {TaskCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskCreateManyArgs>(args?: SelectSubset<T, TaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tasks and returns the data saved in the database.
     * @param {TaskCreateManyAndReturnArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Task.
     * @param {TaskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
     */
    delete<T extends TaskDeleteArgs>(args: SelectSubset<T, TaskDeleteArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Task.
     * @param {TaskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskUpdateArgs>(args: SelectSubset<T, TaskUpdateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tasks.
     * @param {TaskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskDeleteManyArgs>(args?: SelectSubset<T, TaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskUpdateManyArgs>(args: SelectSubset<T, TaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks and returns the data updated in the database.
     * @param {TaskUpdateManyAndReturnArgs} args - Arguments to update many Tasks.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TaskUpdateManyAndReturnArgs>(args: SelectSubset<T, TaskUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Task.
     * @param {TaskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
     */
    upsert<T extends TaskUpsertArgs>(args: SelectSubset<T, TaskUpsertArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends TaskCountArgs>(
      args?: Subset<T, TaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskGroupByArgs['orderBy'] }
        : { orderBy?: TaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Task model
   */
  readonly fields: TaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    agent<T extends Task$agentArgs<ExtArgs> = {}>(args?: Subset<T, Task$agentArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    list<T extends Task$listArgs<ExtArgs> = {}>(args?: Subset<T, Task$listArgs<ExtArgs>>): Prisma__TaskListClient<$Result.GetResult<Prisma.$TaskListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    lead<T extends Task$leadArgs<ExtArgs> = {}>(args?: Subset<T, Task$leadArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Task model
   */
  interface TaskFieldRefs {
    readonly id: FieldRef<"Task", 'String'>
    readonly title: FieldRef<"Task", 'String'>
    readonly description: FieldRef<"Task", 'String'>
    readonly status: FieldRef<"Task", 'String'>
    readonly isImportant: FieldRef<"Task", 'Boolean'>
    readonly dueDate: FieldRef<"Task", 'DateTime'>
    readonly assignedTo: FieldRef<"Task", 'String'>
    readonly listId: FieldRef<"Task", 'String'>
    readonly leadId: FieldRef<"Task", 'String'>
    readonly createdAt: FieldRef<"Task", 'DateTime'>
    readonly updatedAt: FieldRef<"Task", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Task findUnique
   */
  export type TaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findUniqueOrThrow
   */
  export type TaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findFirst
   */
  export type TaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findFirstOrThrow
   */
  export type TaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findMany
   */
  export type TaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Tasks to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task create
   */
  export type TaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to create a Task.
     */
    data: XOR<TaskCreateInput, TaskUncheckedCreateInput>
  }

  /**
   * Task createMany
   */
  export type TaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Task createManyAndReturn
   */
  export type TaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task update
   */
  export type TaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to update a Task.
     */
    data: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
    /**
     * Choose, which Task to update.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task updateMany
   */
  export type TaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to update.
     */
    limit?: number
  }

  /**
   * Task updateManyAndReturn
   */
  export type TaskUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task upsert
   */
  export type TaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The filter to search for the Task to update in case it exists.
     */
    where: TaskWhereUniqueInput
    /**
     * In case the Task found by the `where` argument doesn't exist, create a new Task with this data.
     */
    create: XOR<TaskCreateInput, TaskUncheckedCreateInput>
    /**
     * In case the Task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
  }

  /**
   * Task delete
   */
  export type TaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter which Task to delete.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task deleteMany
   */
  export type TaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tasks to delete
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to delete.
     */
    limit?: number
  }

  /**
   * Task.agent
   */
  export type Task$agentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Task.list
   */
  export type Task$listArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskList
     */
    select?: TaskListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskList
     */
    omit?: TaskListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskListInclude<ExtArgs> | null
    where?: TaskListWhereInput
  }

  /**
   * Task.lead
   */
  export type Task$leadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    where?: LeadWhereInput
  }

  /**
   * Task without action
   */
  export type TaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
  }


  /**
   * Model Page
   */

  export type AggregatePage = {
    _count: PageCountAggregateOutputType | null
    _min: PageMinAggregateOutputType | null
    _max: PageMaxAggregateOutputType | null
  }

  export type PageMinAggregateOutputType = {
    id: string | null
    title: string | null
    slug: string | null
    isPublished: boolean | null
    metaTitle: string | null
    metaDesc: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PageMaxAggregateOutputType = {
    id: string | null
    title: string | null
    slug: string | null
    isPublished: boolean | null
    metaTitle: string | null
    metaDesc: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PageCountAggregateOutputType = {
    id: number
    title: number
    slug: number
    isPublished: number
    metaTitle: number
    metaDesc: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PageMinAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    isPublished?: true
    metaTitle?: true
    metaDesc?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PageMaxAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    isPublished?: true
    metaTitle?: true
    metaDesc?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PageCountAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    isPublished?: true
    metaTitle?: true
    metaDesc?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Page to aggregate.
     */
    where?: PageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pages to fetch.
     */
    orderBy?: PageOrderByWithRelationInput | PageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pages
    **/
    _count?: true | PageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PageMaxAggregateInputType
  }

  export type GetPageAggregateType<T extends PageAggregateArgs> = {
        [P in keyof T & keyof AggregatePage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePage[P]>
      : GetScalarType<T[P], AggregatePage[P]>
  }




  export type PageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PageWhereInput
    orderBy?: PageOrderByWithAggregationInput | PageOrderByWithAggregationInput[]
    by: PageScalarFieldEnum[] | PageScalarFieldEnum
    having?: PageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PageCountAggregateInputType | true
    _min?: PageMinAggregateInputType
    _max?: PageMaxAggregateInputType
  }

  export type PageGroupByOutputType = {
    id: string
    title: string
    slug: string
    isPublished: boolean
    metaTitle: string | null
    metaDesc: string | null
    createdAt: Date
    updatedAt: Date
    _count: PageCountAggregateOutputType | null
    _min: PageMinAggregateOutputType | null
    _max: PageMaxAggregateOutputType | null
  }

  type GetPageGroupByPayload<T extends PageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PageGroupByOutputType[P]>
            : GetScalarType<T[P], PageGroupByOutputType[P]>
        }
      >
    >


  export type PageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    isPublished?: boolean
    metaTitle?: boolean
    metaDesc?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sections?: boolean | Page$sectionsArgs<ExtArgs>
    _count?: boolean | PageCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["page"]>

  export type PageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    isPublished?: boolean
    metaTitle?: boolean
    metaDesc?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["page"]>

  export type PageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    isPublished?: boolean
    metaTitle?: boolean
    metaDesc?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["page"]>

  export type PageSelectScalar = {
    id?: boolean
    title?: boolean
    slug?: boolean
    isPublished?: boolean
    metaTitle?: boolean
    metaDesc?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "slug" | "isPublished" | "metaTitle" | "metaDesc" | "createdAt" | "updatedAt", ExtArgs["result"]["page"]>
  export type PageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sections?: boolean | Page$sectionsArgs<ExtArgs>
    _count?: boolean | PageCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Page"
    objects: {
      sections: Prisma.$SectionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      slug: string
      isPublished: boolean
      metaTitle: string | null
      metaDesc: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["page"]>
    composites: {}
  }

  type PageGetPayload<S extends boolean | null | undefined | PageDefaultArgs> = $Result.GetResult<Prisma.$PagePayload, S>

  type PageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PageCountAggregateInputType | true
    }

  export interface PageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Page'], meta: { name: 'Page' } }
    /**
     * Find zero or one Page that matches the filter.
     * @param {PageFindUniqueArgs} args - Arguments to find a Page
     * @example
     * // Get one Page
     * const page = await prisma.page.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PageFindUniqueArgs>(args: SelectSubset<T, PageFindUniqueArgs<ExtArgs>>): Prisma__PageClient<$Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Page that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PageFindUniqueOrThrowArgs} args - Arguments to find a Page
     * @example
     * // Get one Page
     * const page = await prisma.page.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PageFindUniqueOrThrowArgs>(args: SelectSubset<T, PageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PageClient<$Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Page that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageFindFirstArgs} args - Arguments to find a Page
     * @example
     * // Get one Page
     * const page = await prisma.page.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PageFindFirstArgs>(args?: SelectSubset<T, PageFindFirstArgs<ExtArgs>>): Prisma__PageClient<$Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Page that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageFindFirstOrThrowArgs} args - Arguments to find a Page
     * @example
     * // Get one Page
     * const page = await prisma.page.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PageFindFirstOrThrowArgs>(args?: SelectSubset<T, PageFindFirstOrThrowArgs<ExtArgs>>): Prisma__PageClient<$Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pages
     * const pages = await prisma.page.findMany()
     * 
     * // Get first 10 Pages
     * const pages = await prisma.page.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pageWithIdOnly = await prisma.page.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PageFindManyArgs>(args?: SelectSubset<T, PageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Page.
     * @param {PageCreateArgs} args - Arguments to create a Page.
     * @example
     * // Create one Page
     * const Page = await prisma.page.create({
     *   data: {
     *     // ... data to create a Page
     *   }
     * })
     * 
     */
    create<T extends PageCreateArgs>(args: SelectSubset<T, PageCreateArgs<ExtArgs>>): Prisma__PageClient<$Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pages.
     * @param {PageCreateManyArgs} args - Arguments to create many Pages.
     * @example
     * // Create many Pages
     * const page = await prisma.page.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PageCreateManyArgs>(args?: SelectSubset<T, PageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pages and returns the data saved in the database.
     * @param {PageCreateManyAndReturnArgs} args - Arguments to create many Pages.
     * @example
     * // Create many Pages
     * const page = await prisma.page.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pages and only return the `id`
     * const pageWithIdOnly = await prisma.page.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PageCreateManyAndReturnArgs>(args?: SelectSubset<T, PageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Page.
     * @param {PageDeleteArgs} args - Arguments to delete one Page.
     * @example
     * // Delete one Page
     * const Page = await prisma.page.delete({
     *   where: {
     *     // ... filter to delete one Page
     *   }
     * })
     * 
     */
    delete<T extends PageDeleteArgs>(args: SelectSubset<T, PageDeleteArgs<ExtArgs>>): Prisma__PageClient<$Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Page.
     * @param {PageUpdateArgs} args - Arguments to update one Page.
     * @example
     * // Update one Page
     * const page = await prisma.page.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PageUpdateArgs>(args: SelectSubset<T, PageUpdateArgs<ExtArgs>>): Prisma__PageClient<$Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pages.
     * @param {PageDeleteManyArgs} args - Arguments to filter Pages to delete.
     * @example
     * // Delete a few Pages
     * const { count } = await prisma.page.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PageDeleteManyArgs>(args?: SelectSubset<T, PageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pages
     * const page = await prisma.page.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PageUpdateManyArgs>(args: SelectSubset<T, PageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pages and returns the data updated in the database.
     * @param {PageUpdateManyAndReturnArgs} args - Arguments to update many Pages.
     * @example
     * // Update many Pages
     * const page = await prisma.page.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Pages and only return the `id`
     * const pageWithIdOnly = await prisma.page.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PageUpdateManyAndReturnArgs>(args: SelectSubset<T, PageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Page.
     * @param {PageUpsertArgs} args - Arguments to update or create a Page.
     * @example
     * // Update or create a Page
     * const page = await prisma.page.upsert({
     *   create: {
     *     // ... data to create a Page
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Page we want to update
     *   }
     * })
     */
    upsert<T extends PageUpsertArgs>(args: SelectSubset<T, PageUpsertArgs<ExtArgs>>): Prisma__PageClient<$Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageCountArgs} args - Arguments to filter Pages to count.
     * @example
     * // Count the number of Pages
     * const count = await prisma.page.count({
     *   where: {
     *     // ... the filter for the Pages we want to count
     *   }
     * })
    **/
    count<T extends PageCountArgs>(
      args?: Subset<T, PageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Page.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PageAggregateArgs>(args: Subset<T, PageAggregateArgs>): Prisma.PrismaPromise<GetPageAggregateType<T>>

    /**
     * Group by Page.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PageGroupByArgs['orderBy'] }
        : { orderBy?: PageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Page model
   */
  readonly fields: PageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Page.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sections<T extends Page$sectionsArgs<ExtArgs> = {}>(args?: Subset<T, Page$sectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Page model
   */
  interface PageFieldRefs {
    readonly id: FieldRef<"Page", 'String'>
    readonly title: FieldRef<"Page", 'String'>
    readonly slug: FieldRef<"Page", 'String'>
    readonly isPublished: FieldRef<"Page", 'Boolean'>
    readonly metaTitle: FieldRef<"Page", 'String'>
    readonly metaDesc: FieldRef<"Page", 'String'>
    readonly createdAt: FieldRef<"Page", 'DateTime'>
    readonly updatedAt: FieldRef<"Page", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Page findUnique
   */
  export type PageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Page
     */
    select?: PageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Page
     */
    omit?: PageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageInclude<ExtArgs> | null
    /**
     * Filter, which Page to fetch.
     */
    where: PageWhereUniqueInput
  }

  /**
   * Page findUniqueOrThrow
   */
  export type PageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Page
     */
    select?: PageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Page
     */
    omit?: PageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageInclude<ExtArgs> | null
    /**
     * Filter, which Page to fetch.
     */
    where: PageWhereUniqueInput
  }

  /**
   * Page findFirst
   */
  export type PageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Page
     */
    select?: PageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Page
     */
    omit?: PageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageInclude<ExtArgs> | null
    /**
     * Filter, which Page to fetch.
     */
    where?: PageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pages to fetch.
     */
    orderBy?: PageOrderByWithRelationInput | PageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pages.
     */
    cursor?: PageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pages.
     */
    distinct?: PageScalarFieldEnum | PageScalarFieldEnum[]
  }

  /**
   * Page findFirstOrThrow
   */
  export type PageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Page
     */
    select?: PageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Page
     */
    omit?: PageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageInclude<ExtArgs> | null
    /**
     * Filter, which Page to fetch.
     */
    where?: PageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pages to fetch.
     */
    orderBy?: PageOrderByWithRelationInput | PageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pages.
     */
    cursor?: PageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pages.
     */
    distinct?: PageScalarFieldEnum | PageScalarFieldEnum[]
  }

  /**
   * Page findMany
   */
  export type PageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Page
     */
    select?: PageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Page
     */
    omit?: PageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageInclude<ExtArgs> | null
    /**
     * Filter, which Pages to fetch.
     */
    where?: PageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pages to fetch.
     */
    orderBy?: PageOrderByWithRelationInput | PageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pages.
     */
    cursor?: PageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pages.
     */
    skip?: number
    distinct?: PageScalarFieldEnum | PageScalarFieldEnum[]
  }

  /**
   * Page create
   */
  export type PageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Page
     */
    select?: PageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Page
     */
    omit?: PageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageInclude<ExtArgs> | null
    /**
     * The data needed to create a Page.
     */
    data: XOR<PageCreateInput, PageUncheckedCreateInput>
  }

  /**
   * Page createMany
   */
  export type PageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pages.
     */
    data: PageCreateManyInput | PageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Page createManyAndReturn
   */
  export type PageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Page
     */
    select?: PageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Page
     */
    omit?: PageOmit<ExtArgs> | null
    /**
     * The data used to create many Pages.
     */
    data: PageCreateManyInput | PageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Page update
   */
  export type PageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Page
     */
    select?: PageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Page
     */
    omit?: PageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageInclude<ExtArgs> | null
    /**
     * The data needed to update a Page.
     */
    data: XOR<PageUpdateInput, PageUncheckedUpdateInput>
    /**
     * Choose, which Page to update.
     */
    where: PageWhereUniqueInput
  }

  /**
   * Page updateMany
   */
  export type PageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pages.
     */
    data: XOR<PageUpdateManyMutationInput, PageUncheckedUpdateManyInput>
    /**
     * Filter which Pages to update
     */
    where?: PageWhereInput
    /**
     * Limit how many Pages to update.
     */
    limit?: number
  }

  /**
   * Page updateManyAndReturn
   */
  export type PageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Page
     */
    select?: PageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Page
     */
    omit?: PageOmit<ExtArgs> | null
    /**
     * The data used to update Pages.
     */
    data: XOR<PageUpdateManyMutationInput, PageUncheckedUpdateManyInput>
    /**
     * Filter which Pages to update
     */
    where?: PageWhereInput
    /**
     * Limit how many Pages to update.
     */
    limit?: number
  }

  /**
   * Page upsert
   */
  export type PageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Page
     */
    select?: PageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Page
     */
    omit?: PageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageInclude<ExtArgs> | null
    /**
     * The filter to search for the Page to update in case it exists.
     */
    where: PageWhereUniqueInput
    /**
     * In case the Page found by the `where` argument doesn't exist, create a new Page with this data.
     */
    create: XOR<PageCreateInput, PageUncheckedCreateInput>
    /**
     * In case the Page was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PageUpdateInput, PageUncheckedUpdateInput>
  }

  /**
   * Page delete
   */
  export type PageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Page
     */
    select?: PageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Page
     */
    omit?: PageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageInclude<ExtArgs> | null
    /**
     * Filter which Page to delete.
     */
    where: PageWhereUniqueInput
  }

  /**
   * Page deleteMany
   */
  export type PageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pages to delete
     */
    where?: PageWhereInput
    /**
     * Limit how many Pages to delete.
     */
    limit?: number
  }

  /**
   * Page.sections
   */
  export type Page$sectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    where?: SectionWhereInput
    orderBy?: SectionOrderByWithRelationInput | SectionOrderByWithRelationInput[]
    cursor?: SectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SectionScalarFieldEnum | SectionScalarFieldEnum[]
  }

  /**
   * Page without action
   */
  export type PageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Page
     */
    select?: PageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Page
     */
    omit?: PageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageInclude<ExtArgs> | null
  }


  /**
   * Model Section
   */

  export type AggregateSection = {
    _count: SectionCountAggregateOutputType | null
    _avg: SectionAvgAggregateOutputType | null
    _sum: SectionSumAggregateOutputType | null
    _min: SectionMinAggregateOutputType | null
    _max: SectionMaxAggregateOutputType | null
  }

  export type SectionAvgAggregateOutputType = {
    order: number | null
  }

  export type SectionSumAggregateOutputType = {
    order: number | null
  }

  export type SectionMinAggregateOutputType = {
    id: string | null
    pageId: string | null
    type: string | null
    order: number | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SectionMaxAggregateOutputType = {
    id: string | null
    pageId: string | null
    type: string | null
    order: number | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SectionCountAggregateOutputType = {
    id: number
    pageId: number
    type: number
    order: number
    content: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SectionAvgAggregateInputType = {
    order?: true
  }

  export type SectionSumAggregateInputType = {
    order?: true
  }

  export type SectionMinAggregateInputType = {
    id?: true
    pageId?: true
    type?: true
    order?: true
    content?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SectionMaxAggregateInputType = {
    id?: true
    pageId?: true
    type?: true
    order?: true
    content?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SectionCountAggregateInputType = {
    id?: true
    pageId?: true
    type?: true
    order?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Section to aggregate.
     */
    where?: SectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sections to fetch.
     */
    orderBy?: SectionOrderByWithRelationInput | SectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sections
    **/
    _count?: true | SectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SectionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SectionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SectionMaxAggregateInputType
  }

  export type GetSectionAggregateType<T extends SectionAggregateArgs> = {
        [P in keyof T & keyof AggregateSection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSection[P]>
      : GetScalarType<T[P], AggregateSection[P]>
  }




  export type SectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SectionWhereInput
    orderBy?: SectionOrderByWithAggregationInput | SectionOrderByWithAggregationInput[]
    by: SectionScalarFieldEnum[] | SectionScalarFieldEnum
    having?: SectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SectionCountAggregateInputType | true
    _avg?: SectionAvgAggregateInputType
    _sum?: SectionSumAggregateInputType
    _min?: SectionMinAggregateInputType
    _max?: SectionMaxAggregateInputType
  }

  export type SectionGroupByOutputType = {
    id: string
    pageId: string
    type: string
    order: number
    content: string
    createdAt: Date
    updatedAt: Date
    _count: SectionCountAggregateOutputType | null
    _avg: SectionAvgAggregateOutputType | null
    _sum: SectionSumAggregateOutputType | null
    _min: SectionMinAggregateOutputType | null
    _max: SectionMaxAggregateOutputType | null
  }

  type GetSectionGroupByPayload<T extends SectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SectionGroupByOutputType[P]>
            : GetScalarType<T[P], SectionGroupByOutputType[P]>
        }
      >
    >


  export type SectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pageId?: boolean
    type?: boolean
    order?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    page?: boolean | PageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["section"]>

  export type SectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pageId?: boolean
    type?: boolean
    order?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    page?: boolean | PageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["section"]>

  export type SectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pageId?: boolean
    type?: boolean
    order?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    page?: boolean | PageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["section"]>

  export type SectionSelectScalar = {
    id?: boolean
    pageId?: boolean
    type?: boolean
    order?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "pageId" | "type" | "order" | "content" | "createdAt" | "updatedAt", ExtArgs["result"]["section"]>
  export type SectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    page?: boolean | PageDefaultArgs<ExtArgs>
  }
  export type SectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    page?: boolean | PageDefaultArgs<ExtArgs>
  }
  export type SectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    page?: boolean | PageDefaultArgs<ExtArgs>
  }

  export type $SectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Section"
    objects: {
      page: Prisma.$PagePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      pageId: string
      type: string
      order: number
      content: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["section"]>
    composites: {}
  }

  type SectionGetPayload<S extends boolean | null | undefined | SectionDefaultArgs> = $Result.GetResult<Prisma.$SectionPayload, S>

  type SectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SectionCountAggregateInputType | true
    }

  export interface SectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Section'], meta: { name: 'Section' } }
    /**
     * Find zero or one Section that matches the filter.
     * @param {SectionFindUniqueArgs} args - Arguments to find a Section
     * @example
     * // Get one Section
     * const section = await prisma.section.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SectionFindUniqueArgs>(args: SelectSubset<T, SectionFindUniqueArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Section that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SectionFindUniqueOrThrowArgs} args - Arguments to find a Section
     * @example
     * // Get one Section
     * const section = await prisma.section.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SectionFindUniqueOrThrowArgs>(args: SelectSubset<T, SectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Section that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionFindFirstArgs} args - Arguments to find a Section
     * @example
     * // Get one Section
     * const section = await prisma.section.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SectionFindFirstArgs>(args?: SelectSubset<T, SectionFindFirstArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Section that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionFindFirstOrThrowArgs} args - Arguments to find a Section
     * @example
     * // Get one Section
     * const section = await prisma.section.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SectionFindFirstOrThrowArgs>(args?: SelectSubset<T, SectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sections
     * const sections = await prisma.section.findMany()
     * 
     * // Get first 10 Sections
     * const sections = await prisma.section.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sectionWithIdOnly = await prisma.section.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SectionFindManyArgs>(args?: SelectSubset<T, SectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Section.
     * @param {SectionCreateArgs} args - Arguments to create a Section.
     * @example
     * // Create one Section
     * const Section = await prisma.section.create({
     *   data: {
     *     // ... data to create a Section
     *   }
     * })
     * 
     */
    create<T extends SectionCreateArgs>(args: SelectSubset<T, SectionCreateArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sections.
     * @param {SectionCreateManyArgs} args - Arguments to create many Sections.
     * @example
     * // Create many Sections
     * const section = await prisma.section.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SectionCreateManyArgs>(args?: SelectSubset<T, SectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sections and returns the data saved in the database.
     * @param {SectionCreateManyAndReturnArgs} args - Arguments to create many Sections.
     * @example
     * // Create many Sections
     * const section = await prisma.section.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sections and only return the `id`
     * const sectionWithIdOnly = await prisma.section.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SectionCreateManyAndReturnArgs>(args?: SelectSubset<T, SectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Section.
     * @param {SectionDeleteArgs} args - Arguments to delete one Section.
     * @example
     * // Delete one Section
     * const Section = await prisma.section.delete({
     *   where: {
     *     // ... filter to delete one Section
     *   }
     * })
     * 
     */
    delete<T extends SectionDeleteArgs>(args: SelectSubset<T, SectionDeleteArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Section.
     * @param {SectionUpdateArgs} args - Arguments to update one Section.
     * @example
     * // Update one Section
     * const section = await prisma.section.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SectionUpdateArgs>(args: SelectSubset<T, SectionUpdateArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sections.
     * @param {SectionDeleteManyArgs} args - Arguments to filter Sections to delete.
     * @example
     * // Delete a few Sections
     * const { count } = await prisma.section.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SectionDeleteManyArgs>(args?: SelectSubset<T, SectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sections
     * const section = await prisma.section.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SectionUpdateManyArgs>(args: SelectSubset<T, SectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sections and returns the data updated in the database.
     * @param {SectionUpdateManyAndReturnArgs} args - Arguments to update many Sections.
     * @example
     * // Update many Sections
     * const section = await prisma.section.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sections and only return the `id`
     * const sectionWithIdOnly = await prisma.section.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SectionUpdateManyAndReturnArgs>(args: SelectSubset<T, SectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Section.
     * @param {SectionUpsertArgs} args - Arguments to update or create a Section.
     * @example
     * // Update or create a Section
     * const section = await prisma.section.upsert({
     *   create: {
     *     // ... data to create a Section
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Section we want to update
     *   }
     * })
     */
    upsert<T extends SectionUpsertArgs>(args: SelectSubset<T, SectionUpsertArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionCountArgs} args - Arguments to filter Sections to count.
     * @example
     * // Count the number of Sections
     * const count = await prisma.section.count({
     *   where: {
     *     // ... the filter for the Sections we want to count
     *   }
     * })
    **/
    count<T extends SectionCountArgs>(
      args?: Subset<T, SectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Section.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SectionAggregateArgs>(args: Subset<T, SectionAggregateArgs>): Prisma.PrismaPromise<GetSectionAggregateType<T>>

    /**
     * Group by Section.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SectionGroupByArgs['orderBy'] }
        : { orderBy?: SectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Section model
   */
  readonly fields: SectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Section.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    page<T extends PageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PageDefaultArgs<ExtArgs>>): Prisma__PageClient<$Result.GetResult<Prisma.$PagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Section model
   */
  interface SectionFieldRefs {
    readonly id: FieldRef<"Section", 'String'>
    readonly pageId: FieldRef<"Section", 'String'>
    readonly type: FieldRef<"Section", 'String'>
    readonly order: FieldRef<"Section", 'Int'>
    readonly content: FieldRef<"Section", 'String'>
    readonly createdAt: FieldRef<"Section", 'DateTime'>
    readonly updatedAt: FieldRef<"Section", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Section findUnique
   */
  export type SectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * Filter, which Section to fetch.
     */
    where: SectionWhereUniqueInput
  }

  /**
   * Section findUniqueOrThrow
   */
  export type SectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * Filter, which Section to fetch.
     */
    where: SectionWhereUniqueInput
  }

  /**
   * Section findFirst
   */
  export type SectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * Filter, which Section to fetch.
     */
    where?: SectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sections to fetch.
     */
    orderBy?: SectionOrderByWithRelationInput | SectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sections.
     */
    cursor?: SectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sections.
     */
    distinct?: SectionScalarFieldEnum | SectionScalarFieldEnum[]
  }

  /**
   * Section findFirstOrThrow
   */
  export type SectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * Filter, which Section to fetch.
     */
    where?: SectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sections to fetch.
     */
    orderBy?: SectionOrderByWithRelationInput | SectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sections.
     */
    cursor?: SectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sections.
     */
    distinct?: SectionScalarFieldEnum | SectionScalarFieldEnum[]
  }

  /**
   * Section findMany
   */
  export type SectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * Filter, which Sections to fetch.
     */
    where?: SectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sections to fetch.
     */
    orderBy?: SectionOrderByWithRelationInput | SectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sections.
     */
    cursor?: SectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sections.
     */
    skip?: number
    distinct?: SectionScalarFieldEnum | SectionScalarFieldEnum[]
  }

  /**
   * Section create
   */
  export type SectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * The data needed to create a Section.
     */
    data: XOR<SectionCreateInput, SectionUncheckedCreateInput>
  }

  /**
   * Section createMany
   */
  export type SectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sections.
     */
    data: SectionCreateManyInput | SectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Section createManyAndReturn
   */
  export type SectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * The data used to create many Sections.
     */
    data: SectionCreateManyInput | SectionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Section update
   */
  export type SectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * The data needed to update a Section.
     */
    data: XOR<SectionUpdateInput, SectionUncheckedUpdateInput>
    /**
     * Choose, which Section to update.
     */
    where: SectionWhereUniqueInput
  }

  /**
   * Section updateMany
   */
  export type SectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sections.
     */
    data: XOR<SectionUpdateManyMutationInput, SectionUncheckedUpdateManyInput>
    /**
     * Filter which Sections to update
     */
    where?: SectionWhereInput
    /**
     * Limit how many Sections to update.
     */
    limit?: number
  }

  /**
   * Section updateManyAndReturn
   */
  export type SectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * The data used to update Sections.
     */
    data: XOR<SectionUpdateManyMutationInput, SectionUncheckedUpdateManyInput>
    /**
     * Filter which Sections to update
     */
    where?: SectionWhereInput
    /**
     * Limit how many Sections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Section upsert
   */
  export type SectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * The filter to search for the Section to update in case it exists.
     */
    where: SectionWhereUniqueInput
    /**
     * In case the Section found by the `where` argument doesn't exist, create a new Section with this data.
     */
    create: XOR<SectionCreateInput, SectionUncheckedCreateInput>
    /**
     * In case the Section was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SectionUpdateInput, SectionUncheckedUpdateInput>
  }

  /**
   * Section delete
   */
  export type SectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * Filter which Section to delete.
     */
    where: SectionWhereUniqueInput
  }

  /**
   * Section deleteMany
   */
  export type SectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sections to delete
     */
    where?: SectionWhereInput
    /**
     * Limit how many Sections to delete.
     */
    limit?: number
  }

  /**
   * Section without action
   */
  export type SectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
  }


  /**
   * Model SiteSettings
   */

  export type AggregateSiteSettings = {
    _count: SiteSettingsCountAggregateOutputType | null
    _min: SiteSettingsMinAggregateOutputType | null
    _max: SiteSettingsMaxAggregateOutputType | null
  }

  export type SiteSettingsMinAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SiteSettingsMaxAggregateOutputType = {
    id: string | null
    key: string | null
    value: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SiteSettingsCountAggregateOutputType = {
    id: number
    key: number
    value: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SiteSettingsMinAggregateInputType = {
    id?: true
    key?: true
    value?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SiteSettingsMaxAggregateInputType = {
    id?: true
    key?: true
    value?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SiteSettingsCountAggregateInputType = {
    id?: true
    key?: true
    value?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SiteSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SiteSettings to aggregate.
     */
    where?: SiteSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteSettings to fetch.
     */
    orderBy?: SiteSettingsOrderByWithRelationInput | SiteSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SiteSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SiteSettings
    **/
    _count?: true | SiteSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SiteSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SiteSettingsMaxAggregateInputType
  }

  export type GetSiteSettingsAggregateType<T extends SiteSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateSiteSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSiteSettings[P]>
      : GetScalarType<T[P], AggregateSiteSettings[P]>
  }




  export type SiteSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SiteSettingsWhereInput
    orderBy?: SiteSettingsOrderByWithAggregationInput | SiteSettingsOrderByWithAggregationInput[]
    by: SiteSettingsScalarFieldEnum[] | SiteSettingsScalarFieldEnum
    having?: SiteSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SiteSettingsCountAggregateInputType | true
    _min?: SiteSettingsMinAggregateInputType
    _max?: SiteSettingsMaxAggregateInputType
  }

  export type SiteSettingsGroupByOutputType = {
    id: string
    key: string
    value: string
    createdAt: Date
    updatedAt: Date
    _count: SiteSettingsCountAggregateOutputType | null
    _min: SiteSettingsMinAggregateOutputType | null
    _max: SiteSettingsMaxAggregateOutputType | null
  }

  type GetSiteSettingsGroupByPayload<T extends SiteSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SiteSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SiteSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SiteSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], SiteSettingsGroupByOutputType[P]>
        }
      >
    >


  export type SiteSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["siteSettings"]>

  export type SiteSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["siteSettings"]>

  export type SiteSettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["siteSettings"]>

  export type SiteSettingsSelectScalar = {
    id?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SiteSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "value" | "createdAt" | "updatedAt", ExtArgs["result"]["siteSettings"]>

  export type $SiteSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SiteSettings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      value: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["siteSettings"]>
    composites: {}
  }

  type SiteSettingsGetPayload<S extends boolean | null | undefined | SiteSettingsDefaultArgs> = $Result.GetResult<Prisma.$SiteSettingsPayload, S>

  type SiteSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SiteSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SiteSettingsCountAggregateInputType | true
    }

  export interface SiteSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SiteSettings'], meta: { name: 'SiteSettings' } }
    /**
     * Find zero or one SiteSettings that matches the filter.
     * @param {SiteSettingsFindUniqueArgs} args - Arguments to find a SiteSettings
     * @example
     * // Get one SiteSettings
     * const siteSettings = await prisma.siteSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SiteSettingsFindUniqueArgs>(args: SelectSubset<T, SiteSettingsFindUniqueArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SiteSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SiteSettingsFindUniqueOrThrowArgs} args - Arguments to find a SiteSettings
     * @example
     * // Get one SiteSettings
     * const siteSettings = await prisma.siteSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SiteSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, SiteSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SiteSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteSettingsFindFirstArgs} args - Arguments to find a SiteSettings
     * @example
     * // Get one SiteSettings
     * const siteSettings = await prisma.siteSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SiteSettingsFindFirstArgs>(args?: SelectSubset<T, SiteSettingsFindFirstArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SiteSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteSettingsFindFirstOrThrowArgs} args - Arguments to find a SiteSettings
     * @example
     * // Get one SiteSettings
     * const siteSettings = await prisma.siteSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SiteSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, SiteSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SiteSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SiteSettings
     * const siteSettings = await prisma.siteSettings.findMany()
     * 
     * // Get first 10 SiteSettings
     * const siteSettings = await prisma.siteSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const siteSettingsWithIdOnly = await prisma.siteSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SiteSettingsFindManyArgs>(args?: SelectSubset<T, SiteSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SiteSettings.
     * @param {SiteSettingsCreateArgs} args - Arguments to create a SiteSettings.
     * @example
     * // Create one SiteSettings
     * const SiteSettings = await prisma.siteSettings.create({
     *   data: {
     *     // ... data to create a SiteSettings
     *   }
     * })
     * 
     */
    create<T extends SiteSettingsCreateArgs>(args: SelectSubset<T, SiteSettingsCreateArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SiteSettings.
     * @param {SiteSettingsCreateManyArgs} args - Arguments to create many SiteSettings.
     * @example
     * // Create many SiteSettings
     * const siteSettings = await prisma.siteSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SiteSettingsCreateManyArgs>(args?: SelectSubset<T, SiteSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SiteSettings and returns the data saved in the database.
     * @param {SiteSettingsCreateManyAndReturnArgs} args - Arguments to create many SiteSettings.
     * @example
     * // Create many SiteSettings
     * const siteSettings = await prisma.siteSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SiteSettings and only return the `id`
     * const siteSettingsWithIdOnly = await prisma.siteSettings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SiteSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, SiteSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SiteSettings.
     * @param {SiteSettingsDeleteArgs} args - Arguments to delete one SiteSettings.
     * @example
     * // Delete one SiteSettings
     * const SiteSettings = await prisma.siteSettings.delete({
     *   where: {
     *     // ... filter to delete one SiteSettings
     *   }
     * })
     * 
     */
    delete<T extends SiteSettingsDeleteArgs>(args: SelectSubset<T, SiteSettingsDeleteArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SiteSettings.
     * @param {SiteSettingsUpdateArgs} args - Arguments to update one SiteSettings.
     * @example
     * // Update one SiteSettings
     * const siteSettings = await prisma.siteSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SiteSettingsUpdateArgs>(args: SelectSubset<T, SiteSettingsUpdateArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SiteSettings.
     * @param {SiteSettingsDeleteManyArgs} args - Arguments to filter SiteSettings to delete.
     * @example
     * // Delete a few SiteSettings
     * const { count } = await prisma.siteSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SiteSettingsDeleteManyArgs>(args?: SelectSubset<T, SiteSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SiteSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SiteSettings
     * const siteSettings = await prisma.siteSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SiteSettingsUpdateManyArgs>(args: SelectSubset<T, SiteSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SiteSettings and returns the data updated in the database.
     * @param {SiteSettingsUpdateManyAndReturnArgs} args - Arguments to update many SiteSettings.
     * @example
     * // Update many SiteSettings
     * const siteSettings = await prisma.siteSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SiteSettings and only return the `id`
     * const siteSettingsWithIdOnly = await prisma.siteSettings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SiteSettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, SiteSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SiteSettings.
     * @param {SiteSettingsUpsertArgs} args - Arguments to update or create a SiteSettings.
     * @example
     * // Update or create a SiteSettings
     * const siteSettings = await prisma.siteSettings.upsert({
     *   create: {
     *     // ... data to create a SiteSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SiteSettings we want to update
     *   }
     * })
     */
    upsert<T extends SiteSettingsUpsertArgs>(args: SelectSubset<T, SiteSettingsUpsertArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SiteSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteSettingsCountArgs} args - Arguments to filter SiteSettings to count.
     * @example
     * // Count the number of SiteSettings
     * const count = await prisma.siteSettings.count({
     *   where: {
     *     // ... the filter for the SiteSettings we want to count
     *   }
     * })
    **/
    count<T extends SiteSettingsCountArgs>(
      args?: Subset<T, SiteSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SiteSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SiteSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SiteSettingsAggregateArgs>(args: Subset<T, SiteSettingsAggregateArgs>): Prisma.PrismaPromise<GetSiteSettingsAggregateType<T>>

    /**
     * Group by SiteSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SiteSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SiteSettingsGroupByArgs['orderBy'] }
        : { orderBy?: SiteSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SiteSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSiteSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SiteSettings model
   */
  readonly fields: SiteSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SiteSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SiteSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SiteSettings model
   */
  interface SiteSettingsFieldRefs {
    readonly id: FieldRef<"SiteSettings", 'String'>
    readonly key: FieldRef<"SiteSettings", 'String'>
    readonly value: FieldRef<"SiteSettings", 'String'>
    readonly createdAt: FieldRef<"SiteSettings", 'DateTime'>
    readonly updatedAt: FieldRef<"SiteSettings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SiteSettings findUnique
   */
  export type SiteSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SiteSettings to fetch.
     */
    where: SiteSettingsWhereUniqueInput
  }

  /**
   * SiteSettings findUniqueOrThrow
   */
  export type SiteSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SiteSettings to fetch.
     */
    where: SiteSettingsWhereUniqueInput
  }

  /**
   * SiteSettings findFirst
   */
  export type SiteSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SiteSettings to fetch.
     */
    where?: SiteSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteSettings to fetch.
     */
    orderBy?: SiteSettingsOrderByWithRelationInput | SiteSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SiteSettings.
     */
    cursor?: SiteSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SiteSettings.
     */
    distinct?: SiteSettingsScalarFieldEnum | SiteSettingsScalarFieldEnum[]
  }

  /**
   * SiteSettings findFirstOrThrow
   */
  export type SiteSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SiteSettings to fetch.
     */
    where?: SiteSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteSettings to fetch.
     */
    orderBy?: SiteSettingsOrderByWithRelationInput | SiteSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SiteSettings.
     */
    cursor?: SiteSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SiteSettings.
     */
    distinct?: SiteSettingsScalarFieldEnum | SiteSettingsScalarFieldEnum[]
  }

  /**
   * SiteSettings findMany
   */
  export type SiteSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SiteSettings to fetch.
     */
    where?: SiteSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteSettings to fetch.
     */
    orderBy?: SiteSettingsOrderByWithRelationInput | SiteSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SiteSettings.
     */
    cursor?: SiteSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteSettings.
     */
    skip?: number
    distinct?: SiteSettingsScalarFieldEnum | SiteSettingsScalarFieldEnum[]
  }

  /**
   * SiteSettings create
   */
  export type SiteSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * The data needed to create a SiteSettings.
     */
    data: XOR<SiteSettingsCreateInput, SiteSettingsUncheckedCreateInput>
  }

  /**
   * SiteSettings createMany
   */
  export type SiteSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SiteSettings.
     */
    data: SiteSettingsCreateManyInput | SiteSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SiteSettings createManyAndReturn
   */
  export type SiteSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * The data used to create many SiteSettings.
     */
    data: SiteSettingsCreateManyInput | SiteSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SiteSettings update
   */
  export type SiteSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * The data needed to update a SiteSettings.
     */
    data: XOR<SiteSettingsUpdateInput, SiteSettingsUncheckedUpdateInput>
    /**
     * Choose, which SiteSettings to update.
     */
    where: SiteSettingsWhereUniqueInput
  }

  /**
   * SiteSettings updateMany
   */
  export type SiteSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SiteSettings.
     */
    data: XOR<SiteSettingsUpdateManyMutationInput, SiteSettingsUncheckedUpdateManyInput>
    /**
     * Filter which SiteSettings to update
     */
    where?: SiteSettingsWhereInput
    /**
     * Limit how many SiteSettings to update.
     */
    limit?: number
  }

  /**
   * SiteSettings updateManyAndReturn
   */
  export type SiteSettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * The data used to update SiteSettings.
     */
    data: XOR<SiteSettingsUpdateManyMutationInput, SiteSettingsUncheckedUpdateManyInput>
    /**
     * Filter which SiteSettings to update
     */
    where?: SiteSettingsWhereInput
    /**
     * Limit how many SiteSettings to update.
     */
    limit?: number
  }

  /**
   * SiteSettings upsert
   */
  export type SiteSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * The filter to search for the SiteSettings to update in case it exists.
     */
    where: SiteSettingsWhereUniqueInput
    /**
     * In case the SiteSettings found by the `where` argument doesn't exist, create a new SiteSettings with this data.
     */
    create: XOR<SiteSettingsCreateInput, SiteSettingsUncheckedCreateInput>
    /**
     * In case the SiteSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SiteSettingsUpdateInput, SiteSettingsUncheckedUpdateInput>
  }

  /**
   * SiteSettings delete
   */
  export type SiteSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * Filter which SiteSettings to delete.
     */
    where: SiteSettingsWhereUniqueInput
  }

  /**
   * SiteSettings deleteMany
   */
  export type SiteSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SiteSettings to delete
     */
    where?: SiteSettingsWhereInput
    /**
     * Limit how many SiteSettings to delete.
     */
    limit?: number
  }

  /**
   * SiteSettings without action
   */
  export type SiteSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
  }


  /**
   * Model AiUsage
   */

  export type AggregateAiUsage = {
    _count: AiUsageCountAggregateOutputType | null
    _avg: AiUsageAvgAggregateOutputType | null
    _sum: AiUsageSumAggregateOutputType | null
    _min: AiUsageMinAggregateOutputType | null
    _max: AiUsageMaxAggregateOutputType | null
  }

  export type AiUsageAvgAggregateOutputType = {
    promptTokens: number | null
    completionTokens: number | null
    costUSD: number | null
  }

  export type AiUsageSumAggregateOutputType = {
    promptTokens: number | null
    completionTokens: number | null
    costUSD: number | null
  }

  export type AiUsageMinAggregateOutputType = {
    id: string | null
    provider: string | null
    model: string | null
    operationType: string | null
    promptTokens: number | null
    completionTokens: number | null
    costUSD: number | null
    status: string | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type AiUsageMaxAggregateOutputType = {
    id: string | null
    provider: string | null
    model: string | null
    operationType: string | null
    promptTokens: number | null
    completionTokens: number | null
    costUSD: number | null
    status: string | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type AiUsageCountAggregateOutputType = {
    id: number
    provider: number
    model: number
    operationType: number
    promptTokens: number
    completionTokens: number
    costUSD: number
    status: number
    errorMessage: number
    createdAt: number
    _all: number
  }


  export type AiUsageAvgAggregateInputType = {
    promptTokens?: true
    completionTokens?: true
    costUSD?: true
  }

  export type AiUsageSumAggregateInputType = {
    promptTokens?: true
    completionTokens?: true
    costUSD?: true
  }

  export type AiUsageMinAggregateInputType = {
    id?: true
    provider?: true
    model?: true
    operationType?: true
    promptTokens?: true
    completionTokens?: true
    costUSD?: true
    status?: true
    errorMessage?: true
    createdAt?: true
  }

  export type AiUsageMaxAggregateInputType = {
    id?: true
    provider?: true
    model?: true
    operationType?: true
    promptTokens?: true
    completionTokens?: true
    costUSD?: true
    status?: true
    errorMessage?: true
    createdAt?: true
  }

  export type AiUsageCountAggregateInputType = {
    id?: true
    provider?: true
    model?: true
    operationType?: true
    promptTokens?: true
    completionTokens?: true
    costUSD?: true
    status?: true
    errorMessage?: true
    createdAt?: true
    _all?: true
  }

  export type AiUsageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiUsage to aggregate.
     */
    where?: AiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsages to fetch.
     */
    orderBy?: AiUsageOrderByWithRelationInput | AiUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiUsages
    **/
    _count?: true | AiUsageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiUsageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiUsageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiUsageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiUsageMaxAggregateInputType
  }

  export type GetAiUsageAggregateType<T extends AiUsageAggregateArgs> = {
        [P in keyof T & keyof AggregateAiUsage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiUsage[P]>
      : GetScalarType<T[P], AggregateAiUsage[P]>
  }




  export type AiUsageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiUsageWhereInput
    orderBy?: AiUsageOrderByWithAggregationInput | AiUsageOrderByWithAggregationInput[]
    by: AiUsageScalarFieldEnum[] | AiUsageScalarFieldEnum
    having?: AiUsageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiUsageCountAggregateInputType | true
    _avg?: AiUsageAvgAggregateInputType
    _sum?: AiUsageSumAggregateInputType
    _min?: AiUsageMinAggregateInputType
    _max?: AiUsageMaxAggregateInputType
  }

  export type AiUsageGroupByOutputType = {
    id: string
    provider: string
    model: string
    operationType: string
    promptTokens: number
    completionTokens: number
    costUSD: number
    status: string
    errorMessage: string | null
    createdAt: Date
    _count: AiUsageCountAggregateOutputType | null
    _avg: AiUsageAvgAggregateOutputType | null
    _sum: AiUsageSumAggregateOutputType | null
    _min: AiUsageMinAggregateOutputType | null
    _max: AiUsageMaxAggregateOutputType | null
  }

  type GetAiUsageGroupByPayload<T extends AiUsageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiUsageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiUsageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiUsageGroupByOutputType[P]>
            : GetScalarType<T[P], AiUsageGroupByOutputType[P]>
        }
      >
    >


  export type AiUsageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider?: boolean
    model?: boolean
    operationType?: boolean
    promptTokens?: boolean
    completionTokens?: boolean
    costUSD?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiUsage"]>

  export type AiUsageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider?: boolean
    model?: boolean
    operationType?: boolean
    promptTokens?: boolean
    completionTokens?: boolean
    costUSD?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiUsage"]>

  export type AiUsageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider?: boolean
    model?: boolean
    operationType?: boolean
    promptTokens?: boolean
    completionTokens?: boolean
    costUSD?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiUsage"]>

  export type AiUsageSelectScalar = {
    id?: boolean
    provider?: boolean
    model?: boolean
    operationType?: boolean
    promptTokens?: boolean
    completionTokens?: boolean
    costUSD?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }

  export type AiUsageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "provider" | "model" | "operationType" | "promptTokens" | "completionTokens" | "costUSD" | "status" | "errorMessage" | "createdAt", ExtArgs["result"]["aiUsage"]>

  export type $AiUsagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiUsage"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      provider: string
      model: string
      operationType: string
      promptTokens: number
      completionTokens: number
      costUSD: number
      status: string
      errorMessage: string | null
      createdAt: Date
    }, ExtArgs["result"]["aiUsage"]>
    composites: {}
  }

  type AiUsageGetPayload<S extends boolean | null | undefined | AiUsageDefaultArgs> = $Result.GetResult<Prisma.$AiUsagePayload, S>

  type AiUsageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiUsageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiUsageCountAggregateInputType | true
    }

  export interface AiUsageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiUsage'], meta: { name: 'AiUsage' } }
    /**
     * Find zero or one AiUsage that matches the filter.
     * @param {AiUsageFindUniqueArgs} args - Arguments to find a AiUsage
     * @example
     * // Get one AiUsage
     * const aiUsage = await prisma.aiUsage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiUsageFindUniqueArgs>(args: SelectSubset<T, AiUsageFindUniqueArgs<ExtArgs>>): Prisma__AiUsageClient<$Result.GetResult<Prisma.$AiUsagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiUsage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiUsageFindUniqueOrThrowArgs} args - Arguments to find a AiUsage
     * @example
     * // Get one AiUsage
     * const aiUsage = await prisma.aiUsage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiUsageFindUniqueOrThrowArgs>(args: SelectSubset<T, AiUsageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiUsageClient<$Result.GetResult<Prisma.$AiUsagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiUsage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageFindFirstArgs} args - Arguments to find a AiUsage
     * @example
     * // Get one AiUsage
     * const aiUsage = await prisma.aiUsage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiUsageFindFirstArgs>(args?: SelectSubset<T, AiUsageFindFirstArgs<ExtArgs>>): Prisma__AiUsageClient<$Result.GetResult<Prisma.$AiUsagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiUsage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageFindFirstOrThrowArgs} args - Arguments to find a AiUsage
     * @example
     * // Get one AiUsage
     * const aiUsage = await prisma.aiUsage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiUsageFindFirstOrThrowArgs>(args?: SelectSubset<T, AiUsageFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiUsageClient<$Result.GetResult<Prisma.$AiUsagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiUsages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiUsages
     * const aiUsages = await prisma.aiUsage.findMany()
     * 
     * // Get first 10 AiUsages
     * const aiUsages = await prisma.aiUsage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiUsageWithIdOnly = await prisma.aiUsage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiUsageFindManyArgs>(args?: SelectSubset<T, AiUsageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiUsagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiUsage.
     * @param {AiUsageCreateArgs} args - Arguments to create a AiUsage.
     * @example
     * // Create one AiUsage
     * const AiUsage = await prisma.aiUsage.create({
     *   data: {
     *     // ... data to create a AiUsage
     *   }
     * })
     * 
     */
    create<T extends AiUsageCreateArgs>(args: SelectSubset<T, AiUsageCreateArgs<ExtArgs>>): Prisma__AiUsageClient<$Result.GetResult<Prisma.$AiUsagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiUsages.
     * @param {AiUsageCreateManyArgs} args - Arguments to create many AiUsages.
     * @example
     * // Create many AiUsages
     * const aiUsage = await prisma.aiUsage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiUsageCreateManyArgs>(args?: SelectSubset<T, AiUsageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiUsages and returns the data saved in the database.
     * @param {AiUsageCreateManyAndReturnArgs} args - Arguments to create many AiUsages.
     * @example
     * // Create many AiUsages
     * const aiUsage = await prisma.aiUsage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiUsages and only return the `id`
     * const aiUsageWithIdOnly = await prisma.aiUsage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiUsageCreateManyAndReturnArgs>(args?: SelectSubset<T, AiUsageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiUsagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiUsage.
     * @param {AiUsageDeleteArgs} args - Arguments to delete one AiUsage.
     * @example
     * // Delete one AiUsage
     * const AiUsage = await prisma.aiUsage.delete({
     *   where: {
     *     // ... filter to delete one AiUsage
     *   }
     * })
     * 
     */
    delete<T extends AiUsageDeleteArgs>(args: SelectSubset<T, AiUsageDeleteArgs<ExtArgs>>): Prisma__AiUsageClient<$Result.GetResult<Prisma.$AiUsagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiUsage.
     * @param {AiUsageUpdateArgs} args - Arguments to update one AiUsage.
     * @example
     * // Update one AiUsage
     * const aiUsage = await prisma.aiUsage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiUsageUpdateArgs>(args: SelectSubset<T, AiUsageUpdateArgs<ExtArgs>>): Prisma__AiUsageClient<$Result.GetResult<Prisma.$AiUsagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiUsages.
     * @param {AiUsageDeleteManyArgs} args - Arguments to filter AiUsages to delete.
     * @example
     * // Delete a few AiUsages
     * const { count } = await prisma.aiUsage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiUsageDeleteManyArgs>(args?: SelectSubset<T, AiUsageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiUsages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiUsages
     * const aiUsage = await prisma.aiUsage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiUsageUpdateManyArgs>(args: SelectSubset<T, AiUsageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiUsages and returns the data updated in the database.
     * @param {AiUsageUpdateManyAndReturnArgs} args - Arguments to update many AiUsages.
     * @example
     * // Update many AiUsages
     * const aiUsage = await prisma.aiUsage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiUsages and only return the `id`
     * const aiUsageWithIdOnly = await prisma.aiUsage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiUsageUpdateManyAndReturnArgs>(args: SelectSubset<T, AiUsageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiUsagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiUsage.
     * @param {AiUsageUpsertArgs} args - Arguments to update or create a AiUsage.
     * @example
     * // Update or create a AiUsage
     * const aiUsage = await prisma.aiUsage.upsert({
     *   create: {
     *     // ... data to create a AiUsage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiUsage we want to update
     *   }
     * })
     */
    upsert<T extends AiUsageUpsertArgs>(args: SelectSubset<T, AiUsageUpsertArgs<ExtArgs>>): Prisma__AiUsageClient<$Result.GetResult<Prisma.$AiUsagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiUsages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageCountArgs} args - Arguments to filter AiUsages to count.
     * @example
     * // Count the number of AiUsages
     * const count = await prisma.aiUsage.count({
     *   where: {
     *     // ... the filter for the AiUsages we want to count
     *   }
     * })
    **/
    count<T extends AiUsageCountArgs>(
      args?: Subset<T, AiUsageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiUsageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiUsage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiUsageAggregateArgs>(args: Subset<T, AiUsageAggregateArgs>): Prisma.PrismaPromise<GetAiUsageAggregateType<T>>

    /**
     * Group by AiUsage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiUsageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiUsageGroupByArgs['orderBy'] }
        : { orderBy?: AiUsageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiUsageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiUsageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiUsage model
   */
  readonly fields: AiUsageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiUsage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiUsageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiUsage model
   */
  interface AiUsageFieldRefs {
    readonly id: FieldRef<"AiUsage", 'String'>
    readonly provider: FieldRef<"AiUsage", 'String'>
    readonly model: FieldRef<"AiUsage", 'String'>
    readonly operationType: FieldRef<"AiUsage", 'String'>
    readonly promptTokens: FieldRef<"AiUsage", 'Int'>
    readonly completionTokens: FieldRef<"AiUsage", 'Int'>
    readonly costUSD: FieldRef<"AiUsage", 'Float'>
    readonly status: FieldRef<"AiUsage", 'String'>
    readonly errorMessage: FieldRef<"AiUsage", 'String'>
    readonly createdAt: FieldRef<"AiUsage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiUsage findUnique
   */
  export type AiUsageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsage
     */
    select?: AiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsage
     */
    omit?: AiUsageOmit<ExtArgs> | null
    /**
     * Filter, which AiUsage to fetch.
     */
    where: AiUsageWhereUniqueInput
  }

  /**
   * AiUsage findUniqueOrThrow
   */
  export type AiUsageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsage
     */
    select?: AiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsage
     */
    omit?: AiUsageOmit<ExtArgs> | null
    /**
     * Filter, which AiUsage to fetch.
     */
    where: AiUsageWhereUniqueInput
  }

  /**
   * AiUsage findFirst
   */
  export type AiUsageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsage
     */
    select?: AiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsage
     */
    omit?: AiUsageOmit<ExtArgs> | null
    /**
     * Filter, which AiUsage to fetch.
     */
    where?: AiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsages to fetch.
     */
    orderBy?: AiUsageOrderByWithRelationInput | AiUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiUsages.
     */
    cursor?: AiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiUsages.
     */
    distinct?: AiUsageScalarFieldEnum | AiUsageScalarFieldEnum[]
  }

  /**
   * AiUsage findFirstOrThrow
   */
  export type AiUsageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsage
     */
    select?: AiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsage
     */
    omit?: AiUsageOmit<ExtArgs> | null
    /**
     * Filter, which AiUsage to fetch.
     */
    where?: AiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsages to fetch.
     */
    orderBy?: AiUsageOrderByWithRelationInput | AiUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiUsages.
     */
    cursor?: AiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiUsages.
     */
    distinct?: AiUsageScalarFieldEnum | AiUsageScalarFieldEnum[]
  }

  /**
   * AiUsage findMany
   */
  export type AiUsageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsage
     */
    select?: AiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsage
     */
    omit?: AiUsageOmit<ExtArgs> | null
    /**
     * Filter, which AiUsages to fetch.
     */
    where?: AiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsages to fetch.
     */
    orderBy?: AiUsageOrderByWithRelationInput | AiUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiUsages.
     */
    cursor?: AiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsages.
     */
    skip?: number
    distinct?: AiUsageScalarFieldEnum | AiUsageScalarFieldEnum[]
  }

  /**
   * AiUsage create
   */
  export type AiUsageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsage
     */
    select?: AiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsage
     */
    omit?: AiUsageOmit<ExtArgs> | null
    /**
     * The data needed to create a AiUsage.
     */
    data: XOR<AiUsageCreateInput, AiUsageUncheckedCreateInput>
  }

  /**
   * AiUsage createMany
   */
  export type AiUsageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiUsages.
     */
    data: AiUsageCreateManyInput | AiUsageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiUsage createManyAndReturn
   */
  export type AiUsageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsage
     */
    select?: AiUsageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsage
     */
    omit?: AiUsageOmit<ExtArgs> | null
    /**
     * The data used to create many AiUsages.
     */
    data: AiUsageCreateManyInput | AiUsageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiUsage update
   */
  export type AiUsageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsage
     */
    select?: AiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsage
     */
    omit?: AiUsageOmit<ExtArgs> | null
    /**
     * The data needed to update a AiUsage.
     */
    data: XOR<AiUsageUpdateInput, AiUsageUncheckedUpdateInput>
    /**
     * Choose, which AiUsage to update.
     */
    where: AiUsageWhereUniqueInput
  }

  /**
   * AiUsage updateMany
   */
  export type AiUsageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiUsages.
     */
    data: XOR<AiUsageUpdateManyMutationInput, AiUsageUncheckedUpdateManyInput>
    /**
     * Filter which AiUsages to update
     */
    where?: AiUsageWhereInput
    /**
     * Limit how many AiUsages to update.
     */
    limit?: number
  }

  /**
   * AiUsage updateManyAndReturn
   */
  export type AiUsageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsage
     */
    select?: AiUsageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsage
     */
    omit?: AiUsageOmit<ExtArgs> | null
    /**
     * The data used to update AiUsages.
     */
    data: XOR<AiUsageUpdateManyMutationInput, AiUsageUncheckedUpdateManyInput>
    /**
     * Filter which AiUsages to update
     */
    where?: AiUsageWhereInput
    /**
     * Limit how many AiUsages to update.
     */
    limit?: number
  }

  /**
   * AiUsage upsert
   */
  export type AiUsageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsage
     */
    select?: AiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsage
     */
    omit?: AiUsageOmit<ExtArgs> | null
    /**
     * The filter to search for the AiUsage to update in case it exists.
     */
    where: AiUsageWhereUniqueInput
    /**
     * In case the AiUsage found by the `where` argument doesn't exist, create a new AiUsage with this data.
     */
    create: XOR<AiUsageCreateInput, AiUsageUncheckedCreateInput>
    /**
     * In case the AiUsage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiUsageUpdateInput, AiUsageUncheckedUpdateInput>
  }

  /**
   * AiUsage delete
   */
  export type AiUsageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsage
     */
    select?: AiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsage
     */
    omit?: AiUsageOmit<ExtArgs> | null
    /**
     * Filter which AiUsage to delete.
     */
    where: AiUsageWhereUniqueInput
  }

  /**
   * AiUsage deleteMany
   */
  export type AiUsageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiUsages to delete
     */
    where?: AiUsageWhereInput
    /**
     * Limit how many AiUsages to delete.
     */
    limit?: number
  }

  /**
   * AiUsage without action
   */
  export type AiUsageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsage
     */
    select?: AiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsage
     */
    omit?: AiUsageOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PropertyScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    price: 'price',
    minPrice: 'minPrice',
    maxPrice: 'maxPrice',
    type: 'type',
    status: 'status',
    location: 'location',
    bedrooms: 'bedrooms',
    bathrooms: 'bathrooms',
    area: 'area',
    availableUnits: 'availableUnits',
    deliveryDate: 'deliveryDate',
    images: 'images',
    presentations: 'presentations',
    nearbyPlaces: 'nearbyPlaces',
    dynamicFeatures: 'dynamicFeatures',
    independentUnit: 'independentUnit',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    ownerName: 'ownerName',
    ownerPhone: 'ownerPhone',
    ownerEmail: 'ownerEmail',
    ownerNotes: 'ownerNotes'
  };

  export type PropertyScalarFieldEnum = (typeof PropertyScalarFieldEnum)[keyof typeof PropertyScalarFieldEnum]


  export const LeadScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    status: 'status',
    budget: 'budget',
    notes: 'notes',
    source: 'source',
    preferences: 'preferences',
    requiresMortgage: 'requiresMortgage',
    agentId: 'agentId',
    propertyId: 'propertyId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LeadScalarFieldEnum = (typeof LeadScalarFieldEnum)[keyof typeof LeadScalarFieldEnum]


  export const AppointmentScalarFieldEnum: {
    id: 'id',
    title: 'title',
    date: 'date',
    status: 'status',
    leadId: 'leadId',
    agentId: 'agentId',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AppointmentScalarFieldEnum = (typeof AppointmentScalarFieldEnum)[keyof typeof AppointmentScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    content: 'content',
    fromBot: 'fromBot',
    leadId: 'leadId',
    createdAt: 'createdAt'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const CallScalarFieldEnum: {
    id: 'id',
    leadId: 'leadId',
    duration: 'duration',
    audioUrl: 'audioUrl',
    transcription: 'transcription',
    summary: 'summary',
    mainTopic: 'mainTopic',
    keyPoints: 'keyPoints',
    commitments: 'commitments',
    sentiment: 'sentiment',
    createdAt: 'createdAt'
  };

  export type CallScalarFieldEnum = (typeof CallScalarFieldEnum)[keyof typeof CallScalarFieldEnum]


  export const TaskListScalarFieldEnum: {
    id: 'id',
    name: 'name',
    color: 'color',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TaskListScalarFieldEnum = (typeof TaskListScalarFieldEnum)[keyof typeof TaskListScalarFieldEnum]


  export const TaskScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    status: 'status',
    isImportant: 'isImportant',
    dueDate: 'dueDate',
    assignedTo: 'assignedTo',
    listId: 'listId',
    leadId: 'leadId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const PageScalarFieldEnum: {
    id: 'id',
    title: 'title',
    slug: 'slug',
    isPublished: 'isPublished',
    metaTitle: 'metaTitle',
    metaDesc: 'metaDesc',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PageScalarFieldEnum = (typeof PageScalarFieldEnum)[keyof typeof PageScalarFieldEnum]


  export const SectionScalarFieldEnum: {
    id: 'id',
    pageId: 'pageId',
    type: 'type',
    order: 'order',
    content: 'content',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SectionScalarFieldEnum = (typeof SectionScalarFieldEnum)[keyof typeof SectionScalarFieldEnum]


  export const SiteSettingsScalarFieldEnum: {
    id: 'id',
    key: 'key',
    value: 'value',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SiteSettingsScalarFieldEnum = (typeof SiteSettingsScalarFieldEnum)[keyof typeof SiteSettingsScalarFieldEnum]


  export const AiUsageScalarFieldEnum: {
    id: 'id',
    provider: 'provider',
    model: 'model',
    operationType: 'operationType',
    promptTokens: 'promptTokens',
    completionTokens: 'completionTokens',
    costUSD: 'costUSD',
    status: 'status',
    errorMessage: 'errorMessage',
    createdAt: 'createdAt'
  };

  export type AiUsageScalarFieldEnum = (typeof AiUsageScalarFieldEnum)[keyof typeof AiUsageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    leads?: LeadListRelationFilter
    tasks?: TaskListRelationFilter
    appointments?: AppointmentListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    leads?: LeadOrderByRelationAggregateInput
    tasks?: TaskOrderByRelationAggregateInput
    appointments?: AppointmentOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    leads?: LeadListRelationFilter
    tasks?: TaskListRelationFilter
    appointments?: AppointmentListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type PropertyWhereInput = {
    AND?: PropertyWhereInput | PropertyWhereInput[]
    OR?: PropertyWhereInput[]
    NOT?: PropertyWhereInput | PropertyWhereInput[]
    id?: StringFilter<"Property"> | string
    title?: StringFilter<"Property"> | string
    description?: StringNullableFilter<"Property"> | string | null
    price?: DecimalFilter<"Property"> | Decimal | DecimalJsLike | number | string
    minPrice?: DecimalNullableFilter<"Property"> | Decimal | DecimalJsLike | number | string | null
    maxPrice?: DecimalNullableFilter<"Property"> | Decimal | DecimalJsLike | number | string | null
    type?: StringFilter<"Property"> | string
    status?: StringFilter<"Property"> | string
    location?: StringFilter<"Property"> | string
    bedrooms?: IntNullableFilter<"Property"> | number | null
    bathrooms?: IntNullableFilter<"Property"> | number | null
    area?: FloatNullableFilter<"Property"> | number | null
    availableUnits?: IntNullableFilter<"Property"> | number | null
    deliveryDate?: StringNullableFilter<"Property"> | string | null
    images?: StringNullableFilter<"Property"> | string | null
    presentations?: StringNullableFilter<"Property"> | string | null
    nearbyPlaces?: StringNullableFilter<"Property"> | string | null
    dynamicFeatures?: StringNullableFilter<"Property"> | string | null
    independentUnit?: StringNullableFilter<"Property"> | string | null
    createdAt?: DateTimeFilter<"Property"> | Date | string
    updatedAt?: DateTimeFilter<"Property"> | Date | string
    ownerName?: StringNullableFilter<"Property"> | string | null
    ownerPhone?: StringNullableFilter<"Property"> | string | null
    ownerEmail?: StringNullableFilter<"Property"> | string | null
    ownerNotes?: StringNullableFilter<"Property"> | string | null
    leads?: LeadListRelationFilter
  }

  export type PropertyOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    minPrice?: SortOrderInput | SortOrder
    maxPrice?: SortOrderInput | SortOrder
    type?: SortOrder
    status?: SortOrder
    location?: SortOrder
    bedrooms?: SortOrderInput | SortOrder
    bathrooms?: SortOrderInput | SortOrder
    area?: SortOrderInput | SortOrder
    availableUnits?: SortOrderInput | SortOrder
    deliveryDate?: SortOrderInput | SortOrder
    images?: SortOrderInput | SortOrder
    presentations?: SortOrderInput | SortOrder
    nearbyPlaces?: SortOrderInput | SortOrder
    dynamicFeatures?: SortOrderInput | SortOrder
    independentUnit?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ownerName?: SortOrderInput | SortOrder
    ownerPhone?: SortOrderInput | SortOrder
    ownerEmail?: SortOrderInput | SortOrder
    ownerNotes?: SortOrderInput | SortOrder
    leads?: LeadOrderByRelationAggregateInput
  }

  export type PropertyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PropertyWhereInput | PropertyWhereInput[]
    OR?: PropertyWhereInput[]
    NOT?: PropertyWhereInput | PropertyWhereInput[]
    title?: StringFilter<"Property"> | string
    description?: StringNullableFilter<"Property"> | string | null
    price?: DecimalFilter<"Property"> | Decimal | DecimalJsLike | number | string
    minPrice?: DecimalNullableFilter<"Property"> | Decimal | DecimalJsLike | number | string | null
    maxPrice?: DecimalNullableFilter<"Property"> | Decimal | DecimalJsLike | number | string | null
    type?: StringFilter<"Property"> | string
    status?: StringFilter<"Property"> | string
    location?: StringFilter<"Property"> | string
    bedrooms?: IntNullableFilter<"Property"> | number | null
    bathrooms?: IntNullableFilter<"Property"> | number | null
    area?: FloatNullableFilter<"Property"> | number | null
    availableUnits?: IntNullableFilter<"Property"> | number | null
    deliveryDate?: StringNullableFilter<"Property"> | string | null
    images?: StringNullableFilter<"Property"> | string | null
    presentations?: StringNullableFilter<"Property"> | string | null
    nearbyPlaces?: StringNullableFilter<"Property"> | string | null
    dynamicFeatures?: StringNullableFilter<"Property"> | string | null
    independentUnit?: StringNullableFilter<"Property"> | string | null
    createdAt?: DateTimeFilter<"Property"> | Date | string
    updatedAt?: DateTimeFilter<"Property"> | Date | string
    ownerName?: StringNullableFilter<"Property"> | string | null
    ownerPhone?: StringNullableFilter<"Property"> | string | null
    ownerEmail?: StringNullableFilter<"Property"> | string | null
    ownerNotes?: StringNullableFilter<"Property"> | string | null
    leads?: LeadListRelationFilter
  }, "id">

  export type PropertyOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    minPrice?: SortOrderInput | SortOrder
    maxPrice?: SortOrderInput | SortOrder
    type?: SortOrder
    status?: SortOrder
    location?: SortOrder
    bedrooms?: SortOrderInput | SortOrder
    bathrooms?: SortOrderInput | SortOrder
    area?: SortOrderInput | SortOrder
    availableUnits?: SortOrderInput | SortOrder
    deliveryDate?: SortOrderInput | SortOrder
    images?: SortOrderInput | SortOrder
    presentations?: SortOrderInput | SortOrder
    nearbyPlaces?: SortOrderInput | SortOrder
    dynamicFeatures?: SortOrderInput | SortOrder
    independentUnit?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ownerName?: SortOrderInput | SortOrder
    ownerPhone?: SortOrderInput | SortOrder
    ownerEmail?: SortOrderInput | SortOrder
    ownerNotes?: SortOrderInput | SortOrder
    _count?: PropertyCountOrderByAggregateInput
    _avg?: PropertyAvgOrderByAggregateInput
    _max?: PropertyMaxOrderByAggregateInput
    _min?: PropertyMinOrderByAggregateInput
    _sum?: PropertySumOrderByAggregateInput
  }

  export type PropertyScalarWhereWithAggregatesInput = {
    AND?: PropertyScalarWhereWithAggregatesInput | PropertyScalarWhereWithAggregatesInput[]
    OR?: PropertyScalarWhereWithAggregatesInput[]
    NOT?: PropertyScalarWhereWithAggregatesInput | PropertyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Property"> | string
    title?: StringWithAggregatesFilter<"Property"> | string
    description?: StringNullableWithAggregatesFilter<"Property"> | string | null
    price?: DecimalWithAggregatesFilter<"Property"> | Decimal | DecimalJsLike | number | string
    minPrice?: DecimalNullableWithAggregatesFilter<"Property"> | Decimal | DecimalJsLike | number | string | null
    maxPrice?: DecimalNullableWithAggregatesFilter<"Property"> | Decimal | DecimalJsLike | number | string | null
    type?: StringWithAggregatesFilter<"Property"> | string
    status?: StringWithAggregatesFilter<"Property"> | string
    location?: StringWithAggregatesFilter<"Property"> | string
    bedrooms?: IntNullableWithAggregatesFilter<"Property"> | number | null
    bathrooms?: IntNullableWithAggregatesFilter<"Property"> | number | null
    area?: FloatNullableWithAggregatesFilter<"Property"> | number | null
    availableUnits?: IntNullableWithAggregatesFilter<"Property"> | number | null
    deliveryDate?: StringNullableWithAggregatesFilter<"Property"> | string | null
    images?: StringNullableWithAggregatesFilter<"Property"> | string | null
    presentations?: StringNullableWithAggregatesFilter<"Property"> | string | null
    nearbyPlaces?: StringNullableWithAggregatesFilter<"Property"> | string | null
    dynamicFeatures?: StringNullableWithAggregatesFilter<"Property"> | string | null
    independentUnit?: StringNullableWithAggregatesFilter<"Property"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Property"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Property"> | Date | string
    ownerName?: StringNullableWithAggregatesFilter<"Property"> | string | null
    ownerPhone?: StringNullableWithAggregatesFilter<"Property"> | string | null
    ownerEmail?: StringNullableWithAggregatesFilter<"Property"> | string | null
    ownerNotes?: StringNullableWithAggregatesFilter<"Property"> | string | null
  }

  export type LeadWhereInput = {
    AND?: LeadWhereInput | LeadWhereInput[]
    OR?: LeadWhereInput[]
    NOT?: LeadWhereInput | LeadWhereInput[]
    id?: StringFilter<"Lead"> | string
    name?: StringFilter<"Lead"> | string
    email?: StringNullableFilter<"Lead"> | string | null
    phone?: StringFilter<"Lead"> | string
    status?: StringFilter<"Lead"> | string
    budget?: DecimalNullableFilter<"Lead"> | Decimal | DecimalJsLike | number | string | null
    notes?: StringNullableFilter<"Lead"> | string | null
    source?: StringNullableFilter<"Lead"> | string | null
    preferences?: StringNullableFilter<"Lead"> | string | null
    requiresMortgage?: BoolFilter<"Lead"> | boolean
    agentId?: StringNullableFilter<"Lead"> | string | null
    propertyId?: StringNullableFilter<"Lead"> | string | null
    createdAt?: DateTimeFilter<"Lead"> | Date | string
    updatedAt?: DateTimeFilter<"Lead"> | Date | string
    agent?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    property?: XOR<PropertyNullableScalarRelationFilter, PropertyWhereInput> | null
    calls?: CallListRelationFilter
    tasks?: TaskListRelationFilter
    appointments?: AppointmentListRelationFilter
    messages?: MessageListRelationFilter
  }

  export type LeadOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrder
    status?: SortOrder
    budget?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    source?: SortOrderInput | SortOrder
    preferences?: SortOrderInput | SortOrder
    requiresMortgage?: SortOrder
    agentId?: SortOrderInput | SortOrder
    propertyId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    agent?: UserOrderByWithRelationInput
    property?: PropertyOrderByWithRelationInput
    calls?: CallOrderByRelationAggregateInput
    tasks?: TaskOrderByRelationAggregateInput
    appointments?: AppointmentOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
  }

  export type LeadWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LeadWhereInput | LeadWhereInput[]
    OR?: LeadWhereInput[]
    NOT?: LeadWhereInput | LeadWhereInput[]
    name?: StringFilter<"Lead"> | string
    email?: StringNullableFilter<"Lead"> | string | null
    phone?: StringFilter<"Lead"> | string
    status?: StringFilter<"Lead"> | string
    budget?: DecimalNullableFilter<"Lead"> | Decimal | DecimalJsLike | number | string | null
    notes?: StringNullableFilter<"Lead"> | string | null
    source?: StringNullableFilter<"Lead"> | string | null
    preferences?: StringNullableFilter<"Lead"> | string | null
    requiresMortgage?: BoolFilter<"Lead"> | boolean
    agentId?: StringNullableFilter<"Lead"> | string | null
    propertyId?: StringNullableFilter<"Lead"> | string | null
    createdAt?: DateTimeFilter<"Lead"> | Date | string
    updatedAt?: DateTimeFilter<"Lead"> | Date | string
    agent?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    property?: XOR<PropertyNullableScalarRelationFilter, PropertyWhereInput> | null
    calls?: CallListRelationFilter
    tasks?: TaskListRelationFilter
    appointments?: AppointmentListRelationFilter
    messages?: MessageListRelationFilter
  }, "id">

  export type LeadOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrder
    status?: SortOrder
    budget?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    source?: SortOrderInput | SortOrder
    preferences?: SortOrderInput | SortOrder
    requiresMortgage?: SortOrder
    agentId?: SortOrderInput | SortOrder
    propertyId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LeadCountOrderByAggregateInput
    _avg?: LeadAvgOrderByAggregateInput
    _max?: LeadMaxOrderByAggregateInput
    _min?: LeadMinOrderByAggregateInput
    _sum?: LeadSumOrderByAggregateInput
  }

  export type LeadScalarWhereWithAggregatesInput = {
    AND?: LeadScalarWhereWithAggregatesInput | LeadScalarWhereWithAggregatesInput[]
    OR?: LeadScalarWhereWithAggregatesInput[]
    NOT?: LeadScalarWhereWithAggregatesInput | LeadScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Lead"> | string
    name?: StringWithAggregatesFilter<"Lead"> | string
    email?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    phone?: StringWithAggregatesFilter<"Lead"> | string
    status?: StringWithAggregatesFilter<"Lead"> | string
    budget?: DecimalNullableWithAggregatesFilter<"Lead"> | Decimal | DecimalJsLike | number | string | null
    notes?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    source?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    preferences?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    requiresMortgage?: BoolWithAggregatesFilter<"Lead"> | boolean
    agentId?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    propertyId?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Lead"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Lead"> | Date | string
  }

  export type AppointmentWhereInput = {
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    id?: StringFilter<"Appointment"> | string
    title?: StringFilter<"Appointment"> | string
    date?: DateTimeFilter<"Appointment"> | Date | string
    status?: StringFilter<"Appointment"> | string
    leadId?: StringFilter<"Appointment"> | string
    agentId?: StringNullableFilter<"Appointment"> | string | null
    notes?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    lead?: XOR<LeadScalarRelationFilter, LeadWhereInput>
    agent?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type AppointmentOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    date?: SortOrder
    status?: SortOrder
    leadId?: SortOrder
    agentId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lead?: LeadOrderByWithRelationInput
    agent?: UserOrderByWithRelationInput
  }

  export type AppointmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    title?: StringFilter<"Appointment"> | string
    date?: DateTimeFilter<"Appointment"> | Date | string
    status?: StringFilter<"Appointment"> | string
    leadId?: StringFilter<"Appointment"> | string
    agentId?: StringNullableFilter<"Appointment"> | string | null
    notes?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    lead?: XOR<LeadScalarRelationFilter, LeadWhereInput>
    agent?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type AppointmentOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    date?: SortOrder
    status?: SortOrder
    leadId?: SortOrder
    agentId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AppointmentCountOrderByAggregateInput
    _max?: AppointmentMaxOrderByAggregateInput
    _min?: AppointmentMinOrderByAggregateInput
  }

  export type AppointmentScalarWhereWithAggregatesInput = {
    AND?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    OR?: AppointmentScalarWhereWithAggregatesInput[]
    NOT?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Appointment"> | string
    title?: StringWithAggregatesFilter<"Appointment"> | string
    date?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    status?: StringWithAggregatesFilter<"Appointment"> | string
    leadId?: StringWithAggregatesFilter<"Appointment"> | string
    agentId?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    fromBot?: BoolFilter<"Message"> | boolean
    leadId?: StringFilter<"Message"> | string
    createdAt?: DateTimeFilter<"Message"> | Date | string
    lead?: XOR<LeadScalarRelationFilter, LeadWhereInput>
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    fromBot?: SortOrder
    leadId?: SortOrder
    createdAt?: SortOrder
    lead?: LeadOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    content?: StringFilter<"Message"> | string
    fromBot?: BoolFilter<"Message"> | boolean
    leadId?: StringFilter<"Message"> | string
    createdAt?: DateTimeFilter<"Message"> | Date | string
    lead?: XOR<LeadScalarRelationFilter, LeadWhereInput>
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    fromBot?: SortOrder
    leadId?: SortOrder
    createdAt?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    content?: StringWithAggregatesFilter<"Message"> | string
    fromBot?: BoolWithAggregatesFilter<"Message"> | boolean
    leadId?: StringWithAggregatesFilter<"Message"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
  }

  export type CallWhereInput = {
    AND?: CallWhereInput | CallWhereInput[]
    OR?: CallWhereInput[]
    NOT?: CallWhereInput | CallWhereInput[]
    id?: StringFilter<"Call"> | string
    leadId?: StringFilter<"Call"> | string
    duration?: IntFilter<"Call"> | number
    audioUrl?: StringNullableFilter<"Call"> | string | null
    transcription?: StringNullableFilter<"Call"> | string | null
    summary?: StringNullableFilter<"Call"> | string | null
    mainTopic?: StringNullableFilter<"Call"> | string | null
    keyPoints?: StringNullableFilter<"Call"> | string | null
    commitments?: StringNullableFilter<"Call"> | string | null
    sentiment?: StringNullableFilter<"Call"> | string | null
    createdAt?: DateTimeFilter<"Call"> | Date | string
    lead?: XOR<LeadScalarRelationFilter, LeadWhereInput>
  }

  export type CallOrderByWithRelationInput = {
    id?: SortOrder
    leadId?: SortOrder
    duration?: SortOrder
    audioUrl?: SortOrderInput | SortOrder
    transcription?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    mainTopic?: SortOrderInput | SortOrder
    keyPoints?: SortOrderInput | SortOrder
    commitments?: SortOrderInput | SortOrder
    sentiment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    lead?: LeadOrderByWithRelationInput
  }

  export type CallWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CallWhereInput | CallWhereInput[]
    OR?: CallWhereInput[]
    NOT?: CallWhereInput | CallWhereInput[]
    leadId?: StringFilter<"Call"> | string
    duration?: IntFilter<"Call"> | number
    audioUrl?: StringNullableFilter<"Call"> | string | null
    transcription?: StringNullableFilter<"Call"> | string | null
    summary?: StringNullableFilter<"Call"> | string | null
    mainTopic?: StringNullableFilter<"Call"> | string | null
    keyPoints?: StringNullableFilter<"Call"> | string | null
    commitments?: StringNullableFilter<"Call"> | string | null
    sentiment?: StringNullableFilter<"Call"> | string | null
    createdAt?: DateTimeFilter<"Call"> | Date | string
    lead?: XOR<LeadScalarRelationFilter, LeadWhereInput>
  }, "id">

  export type CallOrderByWithAggregationInput = {
    id?: SortOrder
    leadId?: SortOrder
    duration?: SortOrder
    audioUrl?: SortOrderInput | SortOrder
    transcription?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    mainTopic?: SortOrderInput | SortOrder
    keyPoints?: SortOrderInput | SortOrder
    commitments?: SortOrderInput | SortOrder
    sentiment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CallCountOrderByAggregateInput
    _avg?: CallAvgOrderByAggregateInput
    _max?: CallMaxOrderByAggregateInput
    _min?: CallMinOrderByAggregateInput
    _sum?: CallSumOrderByAggregateInput
  }

  export type CallScalarWhereWithAggregatesInput = {
    AND?: CallScalarWhereWithAggregatesInput | CallScalarWhereWithAggregatesInput[]
    OR?: CallScalarWhereWithAggregatesInput[]
    NOT?: CallScalarWhereWithAggregatesInput | CallScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Call"> | string
    leadId?: StringWithAggregatesFilter<"Call"> | string
    duration?: IntWithAggregatesFilter<"Call"> | number
    audioUrl?: StringNullableWithAggregatesFilter<"Call"> | string | null
    transcription?: StringNullableWithAggregatesFilter<"Call"> | string | null
    summary?: StringNullableWithAggregatesFilter<"Call"> | string | null
    mainTopic?: StringNullableWithAggregatesFilter<"Call"> | string | null
    keyPoints?: StringNullableWithAggregatesFilter<"Call"> | string | null
    commitments?: StringNullableWithAggregatesFilter<"Call"> | string | null
    sentiment?: StringNullableWithAggregatesFilter<"Call"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Call"> | Date | string
  }

  export type TaskListWhereInput = {
    AND?: TaskListWhereInput | TaskListWhereInput[]
    OR?: TaskListWhereInput[]
    NOT?: TaskListWhereInput | TaskListWhereInput[]
    id?: StringFilter<"TaskList"> | string
    name?: StringFilter<"TaskList"> | string
    color?: StringNullableFilter<"TaskList"> | string | null
    createdAt?: DateTimeFilter<"TaskList"> | Date | string
    updatedAt?: DateTimeFilter<"TaskList"> | Date | string
    tasks?: TaskListRelationFilter
  }

  export type TaskListOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tasks?: TaskOrderByRelationAggregateInput
  }

  export type TaskListWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskListWhereInput | TaskListWhereInput[]
    OR?: TaskListWhereInput[]
    NOT?: TaskListWhereInput | TaskListWhereInput[]
    name?: StringFilter<"TaskList"> | string
    color?: StringNullableFilter<"TaskList"> | string | null
    createdAt?: DateTimeFilter<"TaskList"> | Date | string
    updatedAt?: DateTimeFilter<"TaskList"> | Date | string
    tasks?: TaskListRelationFilter
  }, "id">

  export type TaskListOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TaskListCountOrderByAggregateInput
    _max?: TaskListMaxOrderByAggregateInput
    _min?: TaskListMinOrderByAggregateInput
  }

  export type TaskListScalarWhereWithAggregatesInput = {
    AND?: TaskListScalarWhereWithAggregatesInput | TaskListScalarWhereWithAggregatesInput[]
    OR?: TaskListScalarWhereWithAggregatesInput[]
    NOT?: TaskListScalarWhereWithAggregatesInput | TaskListScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TaskList"> | string
    name?: StringWithAggregatesFilter<"TaskList"> | string
    color?: StringNullableWithAggregatesFilter<"TaskList"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TaskList"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TaskList"> | Date | string
  }

  export type TaskWhereInput = {
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    id?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    status?: StringFilter<"Task"> | string
    isImportant?: BoolFilter<"Task"> | boolean
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    assignedTo?: StringNullableFilter<"Task"> | string | null
    listId?: StringNullableFilter<"Task"> | string | null
    leadId?: StringNullableFilter<"Task"> | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    agent?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    list?: XOR<TaskListNullableScalarRelationFilter, TaskListWhereInput> | null
    lead?: XOR<LeadNullableScalarRelationFilter, LeadWhereInput> | null
  }

  export type TaskOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    isImportant?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    assignedTo?: SortOrderInput | SortOrder
    listId?: SortOrderInput | SortOrder
    leadId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    agent?: UserOrderByWithRelationInput
    list?: TaskListOrderByWithRelationInput
    lead?: LeadOrderByWithRelationInput
  }

  export type TaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    status?: StringFilter<"Task"> | string
    isImportant?: BoolFilter<"Task"> | boolean
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    assignedTo?: StringNullableFilter<"Task"> | string | null
    listId?: StringNullableFilter<"Task"> | string | null
    leadId?: StringNullableFilter<"Task"> | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    agent?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    list?: XOR<TaskListNullableScalarRelationFilter, TaskListWhereInput> | null
    lead?: XOR<LeadNullableScalarRelationFilter, LeadWhereInput> | null
  }, "id">

  export type TaskOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    isImportant?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    assignedTo?: SortOrderInput | SortOrder
    listId?: SortOrderInput | SortOrder
    leadId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TaskCountOrderByAggregateInput
    _max?: TaskMaxOrderByAggregateInput
    _min?: TaskMinOrderByAggregateInput
  }

  export type TaskScalarWhereWithAggregatesInput = {
    AND?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    OR?: TaskScalarWhereWithAggregatesInput[]
    NOT?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Task"> | string
    title?: StringWithAggregatesFilter<"Task"> | string
    description?: StringNullableWithAggregatesFilter<"Task"> | string | null
    status?: StringWithAggregatesFilter<"Task"> | string
    isImportant?: BoolWithAggregatesFilter<"Task"> | boolean
    dueDate?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    assignedTo?: StringNullableWithAggregatesFilter<"Task"> | string | null
    listId?: StringNullableWithAggregatesFilter<"Task"> | string | null
    leadId?: StringNullableWithAggregatesFilter<"Task"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
  }

  export type PageWhereInput = {
    AND?: PageWhereInput | PageWhereInput[]
    OR?: PageWhereInput[]
    NOT?: PageWhereInput | PageWhereInput[]
    id?: StringFilter<"Page"> | string
    title?: StringFilter<"Page"> | string
    slug?: StringFilter<"Page"> | string
    isPublished?: BoolFilter<"Page"> | boolean
    metaTitle?: StringNullableFilter<"Page"> | string | null
    metaDesc?: StringNullableFilter<"Page"> | string | null
    createdAt?: DateTimeFilter<"Page"> | Date | string
    updatedAt?: DateTimeFilter<"Page"> | Date | string
    sections?: SectionListRelationFilter
  }

  export type PageOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    isPublished?: SortOrder
    metaTitle?: SortOrderInput | SortOrder
    metaDesc?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sections?: SectionOrderByRelationAggregateInput
  }

  export type PageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: PageWhereInput | PageWhereInput[]
    OR?: PageWhereInput[]
    NOT?: PageWhereInput | PageWhereInput[]
    title?: StringFilter<"Page"> | string
    isPublished?: BoolFilter<"Page"> | boolean
    metaTitle?: StringNullableFilter<"Page"> | string | null
    metaDesc?: StringNullableFilter<"Page"> | string | null
    createdAt?: DateTimeFilter<"Page"> | Date | string
    updatedAt?: DateTimeFilter<"Page"> | Date | string
    sections?: SectionListRelationFilter
  }, "id" | "slug">

  export type PageOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    isPublished?: SortOrder
    metaTitle?: SortOrderInput | SortOrder
    metaDesc?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PageCountOrderByAggregateInput
    _max?: PageMaxOrderByAggregateInput
    _min?: PageMinOrderByAggregateInput
  }

  export type PageScalarWhereWithAggregatesInput = {
    AND?: PageScalarWhereWithAggregatesInput | PageScalarWhereWithAggregatesInput[]
    OR?: PageScalarWhereWithAggregatesInput[]
    NOT?: PageScalarWhereWithAggregatesInput | PageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Page"> | string
    title?: StringWithAggregatesFilter<"Page"> | string
    slug?: StringWithAggregatesFilter<"Page"> | string
    isPublished?: BoolWithAggregatesFilter<"Page"> | boolean
    metaTitle?: StringNullableWithAggregatesFilter<"Page"> | string | null
    metaDesc?: StringNullableWithAggregatesFilter<"Page"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Page"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Page"> | Date | string
  }

  export type SectionWhereInput = {
    AND?: SectionWhereInput | SectionWhereInput[]
    OR?: SectionWhereInput[]
    NOT?: SectionWhereInput | SectionWhereInput[]
    id?: StringFilter<"Section"> | string
    pageId?: StringFilter<"Section"> | string
    type?: StringFilter<"Section"> | string
    order?: IntFilter<"Section"> | number
    content?: StringFilter<"Section"> | string
    createdAt?: DateTimeFilter<"Section"> | Date | string
    updatedAt?: DateTimeFilter<"Section"> | Date | string
    page?: XOR<PageScalarRelationFilter, PageWhereInput>
  }

  export type SectionOrderByWithRelationInput = {
    id?: SortOrder
    pageId?: SortOrder
    type?: SortOrder
    order?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    page?: PageOrderByWithRelationInput
  }

  export type SectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SectionWhereInput | SectionWhereInput[]
    OR?: SectionWhereInput[]
    NOT?: SectionWhereInput | SectionWhereInput[]
    pageId?: StringFilter<"Section"> | string
    type?: StringFilter<"Section"> | string
    order?: IntFilter<"Section"> | number
    content?: StringFilter<"Section"> | string
    createdAt?: DateTimeFilter<"Section"> | Date | string
    updatedAt?: DateTimeFilter<"Section"> | Date | string
    page?: XOR<PageScalarRelationFilter, PageWhereInput>
  }, "id">

  export type SectionOrderByWithAggregationInput = {
    id?: SortOrder
    pageId?: SortOrder
    type?: SortOrder
    order?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SectionCountOrderByAggregateInput
    _avg?: SectionAvgOrderByAggregateInput
    _max?: SectionMaxOrderByAggregateInput
    _min?: SectionMinOrderByAggregateInput
    _sum?: SectionSumOrderByAggregateInput
  }

  export type SectionScalarWhereWithAggregatesInput = {
    AND?: SectionScalarWhereWithAggregatesInput | SectionScalarWhereWithAggregatesInput[]
    OR?: SectionScalarWhereWithAggregatesInput[]
    NOT?: SectionScalarWhereWithAggregatesInput | SectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Section"> | string
    pageId?: StringWithAggregatesFilter<"Section"> | string
    type?: StringWithAggregatesFilter<"Section"> | string
    order?: IntWithAggregatesFilter<"Section"> | number
    content?: StringWithAggregatesFilter<"Section"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Section"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Section"> | Date | string
  }

  export type SiteSettingsWhereInput = {
    AND?: SiteSettingsWhereInput | SiteSettingsWhereInput[]
    OR?: SiteSettingsWhereInput[]
    NOT?: SiteSettingsWhereInput | SiteSettingsWhereInput[]
    id?: StringFilter<"SiteSettings"> | string
    key?: StringFilter<"SiteSettings"> | string
    value?: StringFilter<"SiteSettings"> | string
    createdAt?: DateTimeFilter<"SiteSettings"> | Date | string
    updatedAt?: DateTimeFilter<"SiteSettings"> | Date | string
  }

  export type SiteSettingsOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SiteSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: SiteSettingsWhereInput | SiteSettingsWhereInput[]
    OR?: SiteSettingsWhereInput[]
    NOT?: SiteSettingsWhereInput | SiteSettingsWhereInput[]
    value?: StringFilter<"SiteSettings"> | string
    createdAt?: DateTimeFilter<"SiteSettings"> | Date | string
    updatedAt?: DateTimeFilter<"SiteSettings"> | Date | string
  }, "id" | "key">

  export type SiteSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SiteSettingsCountOrderByAggregateInput
    _max?: SiteSettingsMaxOrderByAggregateInput
    _min?: SiteSettingsMinOrderByAggregateInput
  }

  export type SiteSettingsScalarWhereWithAggregatesInput = {
    AND?: SiteSettingsScalarWhereWithAggregatesInput | SiteSettingsScalarWhereWithAggregatesInput[]
    OR?: SiteSettingsScalarWhereWithAggregatesInput[]
    NOT?: SiteSettingsScalarWhereWithAggregatesInput | SiteSettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SiteSettings"> | string
    key?: StringWithAggregatesFilter<"SiteSettings"> | string
    value?: StringWithAggregatesFilter<"SiteSettings"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SiteSettings"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SiteSettings"> | Date | string
  }

  export type AiUsageWhereInput = {
    AND?: AiUsageWhereInput | AiUsageWhereInput[]
    OR?: AiUsageWhereInput[]
    NOT?: AiUsageWhereInput | AiUsageWhereInput[]
    id?: StringFilter<"AiUsage"> | string
    provider?: StringFilter<"AiUsage"> | string
    model?: StringFilter<"AiUsage"> | string
    operationType?: StringFilter<"AiUsage"> | string
    promptTokens?: IntFilter<"AiUsage"> | number
    completionTokens?: IntFilter<"AiUsage"> | number
    costUSD?: FloatFilter<"AiUsage"> | number
    status?: StringFilter<"AiUsage"> | string
    errorMessage?: StringNullableFilter<"AiUsage"> | string | null
    createdAt?: DateTimeFilter<"AiUsage"> | Date | string
  }

  export type AiUsageOrderByWithRelationInput = {
    id?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    operationType?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    costUSD?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AiUsageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiUsageWhereInput | AiUsageWhereInput[]
    OR?: AiUsageWhereInput[]
    NOT?: AiUsageWhereInput | AiUsageWhereInput[]
    provider?: StringFilter<"AiUsage"> | string
    model?: StringFilter<"AiUsage"> | string
    operationType?: StringFilter<"AiUsage"> | string
    promptTokens?: IntFilter<"AiUsage"> | number
    completionTokens?: IntFilter<"AiUsage"> | number
    costUSD?: FloatFilter<"AiUsage"> | number
    status?: StringFilter<"AiUsage"> | string
    errorMessage?: StringNullableFilter<"AiUsage"> | string | null
    createdAt?: DateTimeFilter<"AiUsage"> | Date | string
  }, "id">

  export type AiUsageOrderByWithAggregationInput = {
    id?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    operationType?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    costUSD?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AiUsageCountOrderByAggregateInput
    _avg?: AiUsageAvgOrderByAggregateInput
    _max?: AiUsageMaxOrderByAggregateInput
    _min?: AiUsageMinOrderByAggregateInput
    _sum?: AiUsageSumOrderByAggregateInput
  }

  export type AiUsageScalarWhereWithAggregatesInput = {
    AND?: AiUsageScalarWhereWithAggregatesInput | AiUsageScalarWhereWithAggregatesInput[]
    OR?: AiUsageScalarWhereWithAggregatesInput[]
    NOT?: AiUsageScalarWhereWithAggregatesInput | AiUsageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiUsage"> | string
    provider?: StringWithAggregatesFilter<"AiUsage"> | string
    model?: StringWithAggregatesFilter<"AiUsage"> | string
    operationType?: StringWithAggregatesFilter<"AiUsage"> | string
    promptTokens?: IntWithAggregatesFilter<"AiUsage"> | number
    completionTokens?: IntWithAggregatesFilter<"AiUsage"> | number
    costUSD?: FloatWithAggregatesFilter<"AiUsage"> | number
    status?: StringWithAggregatesFilter<"AiUsage"> | string
    errorMessage?: StringNullableWithAggregatesFilter<"AiUsage"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AiUsage"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadCreateNestedManyWithoutAgentInput
    tasks?: TaskCreateNestedManyWithoutAgentInput
    appointments?: AppointmentCreateNestedManyWithoutAgentInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadUncheckedCreateNestedManyWithoutAgentInput
    tasks?: TaskUncheckedCreateNestedManyWithoutAgentInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutAgentInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUpdateManyWithoutAgentNestedInput
    tasks?: TaskUpdateManyWithoutAgentNestedInput
    appointments?: AppointmentUpdateManyWithoutAgentNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUncheckedUpdateManyWithoutAgentNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutAgentNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyCreateInput = {
    id?: string
    title: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    minPrice?: Decimal | DecimalJsLike | number | string | null
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    type: string
    status?: string
    location: string
    bedrooms?: number | null
    bathrooms?: number | null
    area?: number | null
    availableUnits?: number | null
    deliveryDate?: string | null
    images?: string | null
    presentations?: string | null
    nearbyPlaces?: string | null
    dynamicFeatures?: string | null
    independentUnit?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ownerName?: string | null
    ownerPhone?: string | null
    ownerEmail?: string | null
    ownerNotes?: string | null
    leads?: LeadCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    minPrice?: Decimal | DecimalJsLike | number | string | null
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    type: string
    status?: string
    location: string
    bedrooms?: number | null
    bathrooms?: number | null
    area?: number | null
    availableUnits?: number | null
    deliveryDate?: string | null
    images?: string | null
    presentations?: string | null
    nearbyPlaces?: string | null
    dynamicFeatures?: string | null
    independentUnit?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ownerName?: string | null
    ownerPhone?: string | null
    ownerEmail?: string | null
    ownerNotes?: string | null
    leads?: LeadUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    availableUnits?: NullableIntFieldUpdateOperationsInput | number | null
    deliveryDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: NullableStringFieldUpdateOperationsInput | string | null
    presentations?: NullableStringFieldUpdateOperationsInput | string | null
    nearbyPlaces?: NullableStringFieldUpdateOperationsInput | string | null
    dynamicFeatures?: NullableStringFieldUpdateOperationsInput | string | null
    independentUnit?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerNotes?: NullableStringFieldUpdateOperationsInput | string | null
    leads?: LeadUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    availableUnits?: NullableIntFieldUpdateOperationsInput | number | null
    deliveryDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: NullableStringFieldUpdateOperationsInput | string | null
    presentations?: NullableStringFieldUpdateOperationsInput | string | null
    nearbyPlaces?: NullableStringFieldUpdateOperationsInput | string | null
    dynamicFeatures?: NullableStringFieldUpdateOperationsInput | string | null
    independentUnit?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerNotes?: NullableStringFieldUpdateOperationsInput | string | null
    leads?: LeadUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    minPrice?: Decimal | DecimalJsLike | number | string | null
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    type: string
    status?: string
    location: string
    bedrooms?: number | null
    bathrooms?: number | null
    area?: number | null
    availableUnits?: number | null
    deliveryDate?: string | null
    images?: string | null
    presentations?: string | null
    nearbyPlaces?: string | null
    dynamicFeatures?: string | null
    independentUnit?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ownerName?: string | null
    ownerPhone?: string | null
    ownerEmail?: string | null
    ownerNotes?: string | null
  }

  export type PropertyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    availableUnits?: NullableIntFieldUpdateOperationsInput | number | null
    deliveryDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: NullableStringFieldUpdateOperationsInput | string | null
    presentations?: NullableStringFieldUpdateOperationsInput | string | null
    nearbyPlaces?: NullableStringFieldUpdateOperationsInput | string | null
    dynamicFeatures?: NullableStringFieldUpdateOperationsInput | string | null
    independentUnit?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PropertyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    availableUnits?: NullableIntFieldUpdateOperationsInput | number | null
    deliveryDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: NullableStringFieldUpdateOperationsInput | string | null
    presentations?: NullableStringFieldUpdateOperationsInput | string | null
    nearbyPlaces?: NullableStringFieldUpdateOperationsInput | string | null
    dynamicFeatures?: NullableStringFieldUpdateOperationsInput | string | null
    independentUnit?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LeadCreateInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: UserCreateNestedOneWithoutLeadsInput
    property?: PropertyCreateNestedOneWithoutLeadsInput
    calls?: CallCreateNestedManyWithoutLeadInput
    tasks?: TaskCreateNestedManyWithoutLeadInput
    appointments?: AppointmentCreateNestedManyWithoutLeadInput
    messages?: MessageCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    agentId?: string | null
    propertyId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    calls?: CallUncheckedCreateNestedManyWithoutLeadInput
    tasks?: TaskUncheckedCreateNestedManyWithoutLeadInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutLeadInput
    messages?: MessageUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: UserUpdateOneWithoutLeadsNestedInput
    property?: PropertyUpdateOneWithoutLeadsNestedInput
    calls?: CallUpdateManyWithoutLeadNestedInput
    tasks?: TaskUpdateManyWithoutLeadNestedInput
    appointments?: AppointmentUpdateManyWithoutLeadNestedInput
    messages?: MessageUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    propertyId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    calls?: CallUncheckedUpdateManyWithoutLeadNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutLeadNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutLeadNestedInput
    messages?: MessageUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type LeadCreateManyInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    agentId?: string | null
    propertyId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeadUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    propertyId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateInput = {
    id?: string
    title: string
    date: Date | string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lead: LeadCreateNestedOneWithoutAppointmentsInput
    agent?: UserCreateNestedOneWithoutAppointmentsInput
  }

  export type AppointmentUncheckedCreateInput = {
    id?: string
    title: string
    date: Date | string
    status?: string
    leadId: string
    agentId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lead?: LeadUpdateOneRequiredWithoutAppointmentsNestedInput
    agent?: UserUpdateOneWithoutAppointmentsNestedInput
  }

  export type AppointmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    leadId?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateManyInput = {
    id?: string
    title: string
    date: Date | string
    status?: string
    leadId: string
    agentId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    leadId?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateInput = {
    id?: string
    content: string
    fromBot?: boolean
    createdAt?: Date | string
    lead: LeadCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    content: string
    fromBot?: boolean
    leadId: string
    createdAt?: Date | string
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    fromBot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lead?: LeadUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    fromBot?: BoolFieldUpdateOperationsInput | boolean
    leadId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyInput = {
    id?: string
    content: string
    fromBot?: boolean
    leadId: string
    createdAt?: Date | string
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    fromBot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    fromBot?: BoolFieldUpdateOperationsInput | boolean
    leadId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallCreateInput = {
    id?: string
    duration: number
    audioUrl?: string | null
    transcription?: string | null
    summary?: string | null
    mainTopic?: string | null
    keyPoints?: string | null
    commitments?: string | null
    sentiment?: string | null
    createdAt?: Date | string
    lead: LeadCreateNestedOneWithoutCallsInput
  }

  export type CallUncheckedCreateInput = {
    id?: string
    leadId: string
    duration: number
    audioUrl?: string | null
    transcription?: string | null
    summary?: string | null
    mainTopic?: string | null
    keyPoints?: string | null
    commitments?: string | null
    sentiment?: string | null
    createdAt?: Date | string
  }

  export type CallUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    mainTopic?: NullableStringFieldUpdateOperationsInput | string | null
    keyPoints?: NullableStringFieldUpdateOperationsInput | string | null
    commitments?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lead?: LeadUpdateOneRequiredWithoutCallsNestedInput
  }

  export type CallUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    leadId?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    mainTopic?: NullableStringFieldUpdateOperationsInput | string | null
    keyPoints?: NullableStringFieldUpdateOperationsInput | string | null
    commitments?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallCreateManyInput = {
    id?: string
    leadId: string
    duration: number
    audioUrl?: string | null
    transcription?: string | null
    summary?: string | null
    mainTopic?: string | null
    keyPoints?: string | null
    commitments?: string | null
    sentiment?: string | null
    createdAt?: Date | string
  }

  export type CallUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    mainTopic?: NullableStringFieldUpdateOperationsInput | string | null
    keyPoints?: NullableStringFieldUpdateOperationsInput | string | null
    commitments?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    leadId?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    mainTopic?: NullableStringFieldUpdateOperationsInput | string | null
    keyPoints?: NullableStringFieldUpdateOperationsInput | string | null
    commitments?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskListCreateInput = {
    id?: string
    name: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: TaskCreateNestedManyWithoutListInput
  }

  export type TaskListUncheckedCreateInput = {
    id?: string
    name: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: TaskUncheckedCreateNestedManyWithoutListInput
  }

  export type TaskListUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUpdateManyWithoutListNestedInput
  }

  export type TaskListUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUncheckedUpdateManyWithoutListNestedInput
  }

  export type TaskListCreateManyInput = {
    id?: string
    name: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskListUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskListUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCreateInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    isImportant?: boolean
    dueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: UserCreateNestedOneWithoutTasksInput
    list?: TaskListCreateNestedOneWithoutTasksInput
    lead?: LeadCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    isImportant?: boolean
    dueDate?: Date | string | null
    assignedTo?: string | null
    listId?: string | null
    leadId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isImportant?: BoolFieldUpdateOperationsInput | boolean
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: UserUpdateOneWithoutTasksNestedInput
    list?: TaskListUpdateOneWithoutTasksNestedInput
    lead?: LeadUpdateOneWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isImportant?: BoolFieldUpdateOperationsInput | boolean
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    listId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    isImportant?: boolean
    dueDate?: Date | string | null
    assignedTo?: string | null
    listId?: string | null
    leadId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isImportant?: BoolFieldUpdateOperationsInput | boolean
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isImportant?: BoolFieldUpdateOperationsInput | boolean
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    listId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageCreateInput = {
    id?: string
    title: string
    slug: string
    isPublished?: boolean
    metaTitle?: string | null
    metaDesc?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sections?: SectionCreateNestedManyWithoutPageInput
  }

  export type PageUncheckedCreateInput = {
    id?: string
    title: string
    slug: string
    isPublished?: boolean
    metaTitle?: string | null
    metaDesc?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sections?: SectionUncheckedCreateNestedManyWithoutPageInput
  }

  export type PageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    metaTitle?: NullableStringFieldUpdateOperationsInput | string | null
    metaDesc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sections?: SectionUpdateManyWithoutPageNestedInput
  }

  export type PageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    metaTitle?: NullableStringFieldUpdateOperationsInput | string | null
    metaDesc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sections?: SectionUncheckedUpdateManyWithoutPageNestedInput
  }

  export type PageCreateManyInput = {
    id?: string
    title: string
    slug: string
    isPublished?: boolean
    metaTitle?: string | null
    metaDesc?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    metaTitle?: NullableStringFieldUpdateOperationsInput | string | null
    metaDesc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    metaTitle?: NullableStringFieldUpdateOperationsInput | string | null
    metaDesc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SectionCreateInput = {
    id?: string
    type: string
    order?: number
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    page: PageCreateNestedOneWithoutSectionsInput
  }

  export type SectionUncheckedCreateInput = {
    id?: string
    pageId: string
    type: string
    order?: number
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    page?: PageUpdateOneRequiredWithoutSectionsNestedInput
  }

  export type SectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pageId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SectionCreateManyInput = {
    id?: string
    pageId: string
    type: string
    order?: number
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    pageId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SiteSettingsCreateInput = {
    id?: string
    key: string
    value: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SiteSettingsUncheckedCreateInput = {
    id?: string
    key: string
    value: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SiteSettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SiteSettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SiteSettingsCreateManyInput = {
    id?: string
    key: string
    value: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SiteSettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SiteSettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageCreateInput = {
    id?: string
    provider: string
    model: string
    operationType: string
    promptTokens?: number
    completionTokens?: number
    costUSD?: number
    status?: string
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AiUsageUncheckedCreateInput = {
    id?: string
    provider: string
    model: string
    operationType: string
    promptTokens?: number
    completionTokens?: number
    costUSD?: number
    status?: string
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AiUsageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    operationType?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    costUSD?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    operationType?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    costUSD?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageCreateManyInput = {
    id?: string
    provider: string
    model: string
    operationType: string
    promptTokens?: number
    completionTokens?: number
    costUSD?: number
    status?: string
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AiUsageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    operationType?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    costUSD?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    operationType?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    costUSD?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type LeadListRelationFilter = {
    every?: LeadWhereInput
    some?: LeadWhereInput
    none?: LeadWhereInput
  }

  export type TaskListRelationFilter = {
    every?: TaskWhereInput
    some?: TaskWhereInput
    none?: TaskWhereInput
  }

  export type AppointmentListRelationFilter = {
    every?: AppointmentWhereInput
    some?: AppointmentWhereInput
    none?: AppointmentWhereInput
  }

  export type LeadOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AppointmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PropertyCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    minPrice?: SortOrder
    maxPrice?: SortOrder
    type?: SortOrder
    status?: SortOrder
    location?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    area?: SortOrder
    availableUnits?: SortOrder
    deliveryDate?: SortOrder
    images?: SortOrder
    presentations?: SortOrder
    nearbyPlaces?: SortOrder
    dynamicFeatures?: SortOrder
    independentUnit?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ownerName?: SortOrder
    ownerPhone?: SortOrder
    ownerEmail?: SortOrder
    ownerNotes?: SortOrder
  }

  export type PropertyAvgOrderByAggregateInput = {
    price?: SortOrder
    minPrice?: SortOrder
    maxPrice?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    area?: SortOrder
    availableUnits?: SortOrder
  }

  export type PropertyMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    minPrice?: SortOrder
    maxPrice?: SortOrder
    type?: SortOrder
    status?: SortOrder
    location?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    area?: SortOrder
    availableUnits?: SortOrder
    deliveryDate?: SortOrder
    images?: SortOrder
    presentations?: SortOrder
    nearbyPlaces?: SortOrder
    dynamicFeatures?: SortOrder
    independentUnit?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ownerName?: SortOrder
    ownerPhone?: SortOrder
    ownerEmail?: SortOrder
    ownerNotes?: SortOrder
  }

  export type PropertyMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price?: SortOrder
    minPrice?: SortOrder
    maxPrice?: SortOrder
    type?: SortOrder
    status?: SortOrder
    location?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    area?: SortOrder
    availableUnits?: SortOrder
    deliveryDate?: SortOrder
    images?: SortOrder
    presentations?: SortOrder
    nearbyPlaces?: SortOrder
    dynamicFeatures?: SortOrder
    independentUnit?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ownerName?: SortOrder
    ownerPhone?: SortOrder
    ownerEmail?: SortOrder
    ownerNotes?: SortOrder
  }

  export type PropertySumOrderByAggregateInput = {
    price?: SortOrder
    minPrice?: SortOrder
    maxPrice?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    area?: SortOrder
    availableUnits?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type PropertyNullableScalarRelationFilter = {
    is?: PropertyWhereInput | null
    isNot?: PropertyWhereInput | null
  }

  export type CallListRelationFilter = {
    every?: CallWhereInput
    some?: CallWhereInput
    none?: CallWhereInput
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type CallOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LeadCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    status?: SortOrder
    budget?: SortOrder
    notes?: SortOrder
    source?: SortOrder
    preferences?: SortOrder
    requiresMortgage?: SortOrder
    agentId?: SortOrder
    propertyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeadAvgOrderByAggregateInput = {
    budget?: SortOrder
  }

  export type LeadMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    status?: SortOrder
    budget?: SortOrder
    notes?: SortOrder
    source?: SortOrder
    preferences?: SortOrder
    requiresMortgage?: SortOrder
    agentId?: SortOrder
    propertyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeadMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    status?: SortOrder
    budget?: SortOrder
    notes?: SortOrder
    source?: SortOrder
    preferences?: SortOrder
    requiresMortgage?: SortOrder
    agentId?: SortOrder
    propertyId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeadSumOrderByAggregateInput = {
    budget?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type LeadScalarRelationFilter = {
    is?: LeadWhereInput
    isNot?: LeadWhereInput
  }

  export type AppointmentCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    date?: SortOrder
    status?: SortOrder
    leadId?: SortOrder
    agentId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    date?: SortOrder
    status?: SortOrder
    leadId?: SortOrder
    agentId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    date?: SortOrder
    status?: SortOrder
    leadId?: SortOrder
    agentId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    fromBot?: SortOrder
    leadId?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    fromBot?: SortOrder
    leadId?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    fromBot?: SortOrder
    leadId?: SortOrder
    createdAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type CallCountOrderByAggregateInput = {
    id?: SortOrder
    leadId?: SortOrder
    duration?: SortOrder
    audioUrl?: SortOrder
    transcription?: SortOrder
    summary?: SortOrder
    mainTopic?: SortOrder
    keyPoints?: SortOrder
    commitments?: SortOrder
    sentiment?: SortOrder
    createdAt?: SortOrder
  }

  export type CallAvgOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type CallMaxOrderByAggregateInput = {
    id?: SortOrder
    leadId?: SortOrder
    duration?: SortOrder
    audioUrl?: SortOrder
    transcription?: SortOrder
    summary?: SortOrder
    mainTopic?: SortOrder
    keyPoints?: SortOrder
    commitments?: SortOrder
    sentiment?: SortOrder
    createdAt?: SortOrder
  }

  export type CallMinOrderByAggregateInput = {
    id?: SortOrder
    leadId?: SortOrder
    duration?: SortOrder
    audioUrl?: SortOrder
    transcription?: SortOrder
    summary?: SortOrder
    mainTopic?: SortOrder
    keyPoints?: SortOrder
    commitments?: SortOrder
    sentiment?: SortOrder
    createdAt?: SortOrder
  }

  export type CallSumOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type TaskListCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskListMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskListMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TaskListNullableScalarRelationFilter = {
    is?: TaskListWhereInput | null
    isNot?: TaskListWhereInput | null
  }

  export type LeadNullableScalarRelationFilter = {
    is?: LeadWhereInput | null
    isNot?: LeadWhereInput | null
  }

  export type TaskCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    isImportant?: SortOrder
    dueDate?: SortOrder
    assignedTo?: SortOrder
    listId?: SortOrder
    leadId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    isImportant?: SortOrder
    dueDate?: SortOrder
    assignedTo?: SortOrder
    listId?: SortOrder
    leadId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    isImportant?: SortOrder
    dueDate?: SortOrder
    assignedTo?: SortOrder
    listId?: SortOrder
    leadId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type SectionListRelationFilter = {
    every?: SectionWhereInput
    some?: SectionWhereInput
    none?: SectionWhereInput
  }

  export type SectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PageCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    isPublished?: SortOrder
    metaTitle?: SortOrder
    metaDesc?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PageMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    isPublished?: SortOrder
    metaTitle?: SortOrder
    metaDesc?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PageMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    isPublished?: SortOrder
    metaTitle?: SortOrder
    metaDesc?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PageScalarRelationFilter = {
    is?: PageWhereInput
    isNot?: PageWhereInput
  }

  export type SectionCountOrderByAggregateInput = {
    id?: SortOrder
    pageId?: SortOrder
    type?: SortOrder
    order?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SectionAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type SectionMaxOrderByAggregateInput = {
    id?: SortOrder
    pageId?: SortOrder
    type?: SortOrder
    order?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SectionMinOrderByAggregateInput = {
    id?: SortOrder
    pageId?: SortOrder
    type?: SortOrder
    order?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SectionSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type SiteSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SiteSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SiteSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type AiUsageCountOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    operationType?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    costUSD?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AiUsageAvgOrderByAggregateInput = {
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    costUSD?: SortOrder
  }

  export type AiUsageMaxOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    operationType?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    costUSD?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AiUsageMinOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    operationType?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    costUSD?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AiUsageSumOrderByAggregateInput = {
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    costUSD?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type LeadCreateNestedManyWithoutAgentInput = {
    create?: XOR<LeadCreateWithoutAgentInput, LeadUncheckedCreateWithoutAgentInput> | LeadCreateWithoutAgentInput[] | LeadUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutAgentInput | LeadCreateOrConnectWithoutAgentInput[]
    createMany?: LeadCreateManyAgentInputEnvelope
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutAgentInput = {
    create?: XOR<TaskCreateWithoutAgentInput, TaskUncheckedCreateWithoutAgentInput> | TaskCreateWithoutAgentInput[] | TaskUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAgentInput | TaskCreateOrConnectWithoutAgentInput[]
    createMany?: TaskCreateManyAgentInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type AppointmentCreateNestedManyWithoutAgentInput = {
    create?: XOR<AppointmentCreateWithoutAgentInput, AppointmentUncheckedCreateWithoutAgentInput> | AppointmentCreateWithoutAgentInput[] | AppointmentUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutAgentInput | AppointmentCreateOrConnectWithoutAgentInput[]
    createMany?: AppointmentCreateManyAgentInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type LeadUncheckedCreateNestedManyWithoutAgentInput = {
    create?: XOR<LeadCreateWithoutAgentInput, LeadUncheckedCreateWithoutAgentInput> | LeadCreateWithoutAgentInput[] | LeadUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutAgentInput | LeadCreateOrConnectWithoutAgentInput[]
    createMany?: LeadCreateManyAgentInputEnvelope
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutAgentInput = {
    create?: XOR<TaskCreateWithoutAgentInput, TaskUncheckedCreateWithoutAgentInput> | TaskCreateWithoutAgentInput[] | TaskUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAgentInput | TaskCreateOrConnectWithoutAgentInput[]
    createMany?: TaskCreateManyAgentInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutAgentInput = {
    create?: XOR<AppointmentCreateWithoutAgentInput, AppointmentUncheckedCreateWithoutAgentInput> | AppointmentCreateWithoutAgentInput[] | AppointmentUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutAgentInput | AppointmentCreateOrConnectWithoutAgentInput[]
    createMany?: AppointmentCreateManyAgentInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LeadUpdateManyWithoutAgentNestedInput = {
    create?: XOR<LeadCreateWithoutAgentInput, LeadUncheckedCreateWithoutAgentInput> | LeadCreateWithoutAgentInput[] | LeadUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutAgentInput | LeadCreateOrConnectWithoutAgentInput[]
    upsert?: LeadUpsertWithWhereUniqueWithoutAgentInput | LeadUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: LeadCreateManyAgentInputEnvelope
    set?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    disconnect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    delete?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    update?: LeadUpdateWithWhereUniqueWithoutAgentInput | LeadUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: LeadUpdateManyWithWhereWithoutAgentInput | LeadUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: LeadScalarWhereInput | LeadScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutAgentNestedInput = {
    create?: XOR<TaskCreateWithoutAgentInput, TaskUncheckedCreateWithoutAgentInput> | TaskCreateWithoutAgentInput[] | TaskUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAgentInput | TaskCreateOrConnectWithoutAgentInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAgentInput | TaskUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: TaskCreateManyAgentInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAgentInput | TaskUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAgentInput | TaskUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type AppointmentUpdateManyWithoutAgentNestedInput = {
    create?: XOR<AppointmentCreateWithoutAgentInput, AppointmentUncheckedCreateWithoutAgentInput> | AppointmentCreateWithoutAgentInput[] | AppointmentUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutAgentInput | AppointmentCreateOrConnectWithoutAgentInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutAgentInput | AppointmentUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: AppointmentCreateManyAgentInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutAgentInput | AppointmentUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutAgentInput | AppointmentUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type LeadUncheckedUpdateManyWithoutAgentNestedInput = {
    create?: XOR<LeadCreateWithoutAgentInput, LeadUncheckedCreateWithoutAgentInput> | LeadCreateWithoutAgentInput[] | LeadUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutAgentInput | LeadCreateOrConnectWithoutAgentInput[]
    upsert?: LeadUpsertWithWhereUniqueWithoutAgentInput | LeadUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: LeadCreateManyAgentInputEnvelope
    set?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    disconnect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    delete?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    update?: LeadUpdateWithWhereUniqueWithoutAgentInput | LeadUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: LeadUpdateManyWithWhereWithoutAgentInput | LeadUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: LeadScalarWhereInput | LeadScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutAgentNestedInput = {
    create?: XOR<TaskCreateWithoutAgentInput, TaskUncheckedCreateWithoutAgentInput> | TaskCreateWithoutAgentInput[] | TaskUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAgentInput | TaskCreateOrConnectWithoutAgentInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAgentInput | TaskUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: TaskCreateManyAgentInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAgentInput | TaskUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAgentInput | TaskUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutAgentNestedInput = {
    create?: XOR<AppointmentCreateWithoutAgentInput, AppointmentUncheckedCreateWithoutAgentInput> | AppointmentCreateWithoutAgentInput[] | AppointmentUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutAgentInput | AppointmentCreateOrConnectWithoutAgentInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutAgentInput | AppointmentUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: AppointmentCreateManyAgentInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutAgentInput | AppointmentUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutAgentInput | AppointmentUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type LeadCreateNestedManyWithoutPropertyInput = {
    create?: XOR<LeadCreateWithoutPropertyInput, LeadUncheckedCreateWithoutPropertyInput> | LeadCreateWithoutPropertyInput[] | LeadUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutPropertyInput | LeadCreateOrConnectWithoutPropertyInput[]
    createMany?: LeadCreateManyPropertyInputEnvelope
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
  }

  export type LeadUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<LeadCreateWithoutPropertyInput, LeadUncheckedCreateWithoutPropertyInput> | LeadCreateWithoutPropertyInput[] | LeadUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutPropertyInput | LeadCreateOrConnectWithoutPropertyInput[]
    createMany?: LeadCreateManyPropertyInputEnvelope
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LeadUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<LeadCreateWithoutPropertyInput, LeadUncheckedCreateWithoutPropertyInput> | LeadCreateWithoutPropertyInput[] | LeadUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutPropertyInput | LeadCreateOrConnectWithoutPropertyInput[]
    upsert?: LeadUpsertWithWhereUniqueWithoutPropertyInput | LeadUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: LeadCreateManyPropertyInputEnvelope
    set?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    disconnect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    delete?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    update?: LeadUpdateWithWhereUniqueWithoutPropertyInput | LeadUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: LeadUpdateManyWithWhereWithoutPropertyInput | LeadUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: LeadScalarWhereInput | LeadScalarWhereInput[]
  }

  export type LeadUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<LeadCreateWithoutPropertyInput, LeadUncheckedCreateWithoutPropertyInput> | LeadCreateWithoutPropertyInput[] | LeadUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutPropertyInput | LeadCreateOrConnectWithoutPropertyInput[]
    upsert?: LeadUpsertWithWhereUniqueWithoutPropertyInput | LeadUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: LeadCreateManyPropertyInputEnvelope
    set?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    disconnect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    delete?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    update?: LeadUpdateWithWhereUniqueWithoutPropertyInput | LeadUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: LeadUpdateManyWithWhereWithoutPropertyInput | LeadUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: LeadScalarWhereInput | LeadScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutLeadsInput = {
    create?: XOR<UserCreateWithoutLeadsInput, UserUncheckedCreateWithoutLeadsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLeadsInput
    connect?: UserWhereUniqueInput
  }

  export type PropertyCreateNestedOneWithoutLeadsInput = {
    create?: XOR<PropertyCreateWithoutLeadsInput, PropertyUncheckedCreateWithoutLeadsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutLeadsInput
    connect?: PropertyWhereUniqueInput
  }

  export type CallCreateNestedManyWithoutLeadInput = {
    create?: XOR<CallCreateWithoutLeadInput, CallUncheckedCreateWithoutLeadInput> | CallCreateWithoutLeadInput[] | CallUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: CallCreateOrConnectWithoutLeadInput | CallCreateOrConnectWithoutLeadInput[]
    createMany?: CallCreateManyLeadInputEnvelope
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutLeadInput = {
    create?: XOR<TaskCreateWithoutLeadInput, TaskUncheckedCreateWithoutLeadInput> | TaskCreateWithoutLeadInput[] | TaskUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutLeadInput | TaskCreateOrConnectWithoutLeadInput[]
    createMany?: TaskCreateManyLeadInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type AppointmentCreateNestedManyWithoutLeadInput = {
    create?: XOR<AppointmentCreateWithoutLeadInput, AppointmentUncheckedCreateWithoutLeadInput> | AppointmentCreateWithoutLeadInput[] | AppointmentUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutLeadInput | AppointmentCreateOrConnectWithoutLeadInput[]
    createMany?: AppointmentCreateManyLeadInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutLeadInput = {
    create?: XOR<MessageCreateWithoutLeadInput, MessageUncheckedCreateWithoutLeadInput> | MessageCreateWithoutLeadInput[] | MessageUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutLeadInput | MessageCreateOrConnectWithoutLeadInput[]
    createMany?: MessageCreateManyLeadInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type CallUncheckedCreateNestedManyWithoutLeadInput = {
    create?: XOR<CallCreateWithoutLeadInput, CallUncheckedCreateWithoutLeadInput> | CallCreateWithoutLeadInput[] | CallUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: CallCreateOrConnectWithoutLeadInput | CallCreateOrConnectWithoutLeadInput[]
    createMany?: CallCreateManyLeadInputEnvelope
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutLeadInput = {
    create?: XOR<TaskCreateWithoutLeadInput, TaskUncheckedCreateWithoutLeadInput> | TaskCreateWithoutLeadInput[] | TaskUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutLeadInput | TaskCreateOrConnectWithoutLeadInput[]
    createMany?: TaskCreateManyLeadInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutLeadInput = {
    create?: XOR<AppointmentCreateWithoutLeadInput, AppointmentUncheckedCreateWithoutLeadInput> | AppointmentCreateWithoutLeadInput[] | AppointmentUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutLeadInput | AppointmentCreateOrConnectWithoutLeadInput[]
    createMany?: AppointmentCreateManyLeadInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutLeadInput = {
    create?: XOR<MessageCreateWithoutLeadInput, MessageUncheckedCreateWithoutLeadInput> | MessageCreateWithoutLeadInput[] | MessageUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutLeadInput | MessageCreateOrConnectWithoutLeadInput[]
    createMany?: MessageCreateManyLeadInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneWithoutLeadsNestedInput = {
    create?: XOR<UserCreateWithoutLeadsInput, UserUncheckedCreateWithoutLeadsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLeadsInput
    upsert?: UserUpsertWithoutLeadsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLeadsInput, UserUpdateWithoutLeadsInput>, UserUncheckedUpdateWithoutLeadsInput>
  }

  export type PropertyUpdateOneWithoutLeadsNestedInput = {
    create?: XOR<PropertyCreateWithoutLeadsInput, PropertyUncheckedCreateWithoutLeadsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutLeadsInput
    upsert?: PropertyUpsertWithoutLeadsInput
    disconnect?: PropertyWhereInput | boolean
    delete?: PropertyWhereInput | boolean
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutLeadsInput, PropertyUpdateWithoutLeadsInput>, PropertyUncheckedUpdateWithoutLeadsInput>
  }

  export type CallUpdateManyWithoutLeadNestedInput = {
    create?: XOR<CallCreateWithoutLeadInput, CallUncheckedCreateWithoutLeadInput> | CallCreateWithoutLeadInput[] | CallUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: CallCreateOrConnectWithoutLeadInput | CallCreateOrConnectWithoutLeadInput[]
    upsert?: CallUpsertWithWhereUniqueWithoutLeadInput | CallUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: CallCreateManyLeadInputEnvelope
    set?: CallWhereUniqueInput | CallWhereUniqueInput[]
    disconnect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    delete?: CallWhereUniqueInput | CallWhereUniqueInput[]
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    update?: CallUpdateWithWhereUniqueWithoutLeadInput | CallUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: CallUpdateManyWithWhereWithoutLeadInput | CallUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: CallScalarWhereInput | CallScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutLeadNestedInput = {
    create?: XOR<TaskCreateWithoutLeadInput, TaskUncheckedCreateWithoutLeadInput> | TaskCreateWithoutLeadInput[] | TaskUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutLeadInput | TaskCreateOrConnectWithoutLeadInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutLeadInput | TaskUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: TaskCreateManyLeadInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutLeadInput | TaskUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutLeadInput | TaskUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type AppointmentUpdateManyWithoutLeadNestedInput = {
    create?: XOR<AppointmentCreateWithoutLeadInput, AppointmentUncheckedCreateWithoutLeadInput> | AppointmentCreateWithoutLeadInput[] | AppointmentUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutLeadInput | AppointmentCreateOrConnectWithoutLeadInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutLeadInput | AppointmentUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: AppointmentCreateManyLeadInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutLeadInput | AppointmentUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutLeadInput | AppointmentUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutLeadNestedInput = {
    create?: XOR<MessageCreateWithoutLeadInput, MessageUncheckedCreateWithoutLeadInput> | MessageCreateWithoutLeadInput[] | MessageUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutLeadInput | MessageCreateOrConnectWithoutLeadInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutLeadInput | MessageUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: MessageCreateManyLeadInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutLeadInput | MessageUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutLeadInput | MessageUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type CallUncheckedUpdateManyWithoutLeadNestedInput = {
    create?: XOR<CallCreateWithoutLeadInput, CallUncheckedCreateWithoutLeadInput> | CallCreateWithoutLeadInput[] | CallUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: CallCreateOrConnectWithoutLeadInput | CallCreateOrConnectWithoutLeadInput[]
    upsert?: CallUpsertWithWhereUniqueWithoutLeadInput | CallUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: CallCreateManyLeadInputEnvelope
    set?: CallWhereUniqueInput | CallWhereUniqueInput[]
    disconnect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    delete?: CallWhereUniqueInput | CallWhereUniqueInput[]
    connect?: CallWhereUniqueInput | CallWhereUniqueInput[]
    update?: CallUpdateWithWhereUniqueWithoutLeadInput | CallUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: CallUpdateManyWithWhereWithoutLeadInput | CallUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: CallScalarWhereInput | CallScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutLeadNestedInput = {
    create?: XOR<TaskCreateWithoutLeadInput, TaskUncheckedCreateWithoutLeadInput> | TaskCreateWithoutLeadInput[] | TaskUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutLeadInput | TaskCreateOrConnectWithoutLeadInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutLeadInput | TaskUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: TaskCreateManyLeadInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutLeadInput | TaskUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutLeadInput | TaskUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutLeadNestedInput = {
    create?: XOR<AppointmentCreateWithoutLeadInput, AppointmentUncheckedCreateWithoutLeadInput> | AppointmentCreateWithoutLeadInput[] | AppointmentUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutLeadInput | AppointmentCreateOrConnectWithoutLeadInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutLeadInput | AppointmentUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: AppointmentCreateManyLeadInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutLeadInput | AppointmentUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutLeadInput | AppointmentUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutLeadNestedInput = {
    create?: XOR<MessageCreateWithoutLeadInput, MessageUncheckedCreateWithoutLeadInput> | MessageCreateWithoutLeadInput[] | MessageUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutLeadInput | MessageCreateOrConnectWithoutLeadInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutLeadInput | MessageUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: MessageCreateManyLeadInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutLeadInput | MessageUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutLeadInput | MessageUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type LeadCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<LeadCreateWithoutAppointmentsInput, LeadUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: LeadCreateOrConnectWithoutAppointmentsInput
    connect?: LeadWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<UserCreateWithoutAppointmentsInput, UserUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAppointmentsInput
    connect?: UserWhereUniqueInput
  }

  export type LeadUpdateOneRequiredWithoutAppointmentsNestedInput = {
    create?: XOR<LeadCreateWithoutAppointmentsInput, LeadUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: LeadCreateOrConnectWithoutAppointmentsInput
    upsert?: LeadUpsertWithoutAppointmentsInput
    connect?: LeadWhereUniqueInput
    update?: XOR<XOR<LeadUpdateToOneWithWhereWithoutAppointmentsInput, LeadUpdateWithoutAppointmentsInput>, LeadUncheckedUpdateWithoutAppointmentsInput>
  }

  export type UserUpdateOneWithoutAppointmentsNestedInput = {
    create?: XOR<UserCreateWithoutAppointmentsInput, UserUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAppointmentsInput
    upsert?: UserUpsertWithoutAppointmentsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAppointmentsInput, UserUpdateWithoutAppointmentsInput>, UserUncheckedUpdateWithoutAppointmentsInput>
  }

  export type LeadCreateNestedOneWithoutMessagesInput = {
    create?: XOR<LeadCreateWithoutMessagesInput, LeadUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: LeadCreateOrConnectWithoutMessagesInput
    connect?: LeadWhereUniqueInput
  }

  export type LeadUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<LeadCreateWithoutMessagesInput, LeadUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: LeadCreateOrConnectWithoutMessagesInput
    upsert?: LeadUpsertWithoutMessagesInput
    connect?: LeadWhereUniqueInput
    update?: XOR<XOR<LeadUpdateToOneWithWhereWithoutMessagesInput, LeadUpdateWithoutMessagesInput>, LeadUncheckedUpdateWithoutMessagesInput>
  }

  export type LeadCreateNestedOneWithoutCallsInput = {
    create?: XOR<LeadCreateWithoutCallsInput, LeadUncheckedCreateWithoutCallsInput>
    connectOrCreate?: LeadCreateOrConnectWithoutCallsInput
    connect?: LeadWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LeadUpdateOneRequiredWithoutCallsNestedInput = {
    create?: XOR<LeadCreateWithoutCallsInput, LeadUncheckedCreateWithoutCallsInput>
    connectOrCreate?: LeadCreateOrConnectWithoutCallsInput
    upsert?: LeadUpsertWithoutCallsInput
    connect?: LeadWhereUniqueInput
    update?: XOR<XOR<LeadUpdateToOneWithWhereWithoutCallsInput, LeadUpdateWithoutCallsInput>, LeadUncheckedUpdateWithoutCallsInput>
  }

  export type TaskCreateNestedManyWithoutListInput = {
    create?: XOR<TaskCreateWithoutListInput, TaskUncheckedCreateWithoutListInput> | TaskCreateWithoutListInput[] | TaskUncheckedCreateWithoutListInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutListInput | TaskCreateOrConnectWithoutListInput[]
    createMany?: TaskCreateManyListInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutListInput = {
    create?: XOR<TaskCreateWithoutListInput, TaskUncheckedCreateWithoutListInput> | TaskCreateWithoutListInput[] | TaskUncheckedCreateWithoutListInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutListInput | TaskCreateOrConnectWithoutListInput[]
    createMany?: TaskCreateManyListInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type TaskUpdateManyWithoutListNestedInput = {
    create?: XOR<TaskCreateWithoutListInput, TaskUncheckedCreateWithoutListInput> | TaskCreateWithoutListInput[] | TaskUncheckedCreateWithoutListInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutListInput | TaskCreateOrConnectWithoutListInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutListInput | TaskUpsertWithWhereUniqueWithoutListInput[]
    createMany?: TaskCreateManyListInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutListInput | TaskUpdateWithWhereUniqueWithoutListInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutListInput | TaskUpdateManyWithWhereWithoutListInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutListNestedInput = {
    create?: XOR<TaskCreateWithoutListInput, TaskUncheckedCreateWithoutListInput> | TaskCreateWithoutListInput[] | TaskUncheckedCreateWithoutListInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutListInput | TaskCreateOrConnectWithoutListInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutListInput | TaskUpsertWithWhereUniqueWithoutListInput[]
    createMany?: TaskCreateManyListInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutListInput | TaskUpdateWithWhereUniqueWithoutListInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutListInput | TaskUpdateManyWithWhereWithoutListInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTasksInput = {
    create?: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutTasksInput
    connect?: UserWhereUniqueInput
  }

  export type TaskListCreateNestedOneWithoutTasksInput = {
    create?: XOR<TaskListCreateWithoutTasksInput, TaskListUncheckedCreateWithoutTasksInput>
    connectOrCreate?: TaskListCreateOrConnectWithoutTasksInput
    connect?: TaskListWhereUniqueInput
  }

  export type LeadCreateNestedOneWithoutTasksInput = {
    create?: XOR<LeadCreateWithoutTasksInput, LeadUncheckedCreateWithoutTasksInput>
    connectOrCreate?: LeadCreateOrConnectWithoutTasksInput
    connect?: LeadWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneWithoutTasksNestedInput = {
    create?: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutTasksInput
    upsert?: UserUpsertWithoutTasksInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTasksInput, UserUpdateWithoutTasksInput>, UserUncheckedUpdateWithoutTasksInput>
  }

  export type TaskListUpdateOneWithoutTasksNestedInput = {
    create?: XOR<TaskListCreateWithoutTasksInput, TaskListUncheckedCreateWithoutTasksInput>
    connectOrCreate?: TaskListCreateOrConnectWithoutTasksInput
    upsert?: TaskListUpsertWithoutTasksInput
    disconnect?: TaskListWhereInput | boolean
    delete?: TaskListWhereInput | boolean
    connect?: TaskListWhereUniqueInput
    update?: XOR<XOR<TaskListUpdateToOneWithWhereWithoutTasksInput, TaskListUpdateWithoutTasksInput>, TaskListUncheckedUpdateWithoutTasksInput>
  }

  export type LeadUpdateOneWithoutTasksNestedInput = {
    create?: XOR<LeadCreateWithoutTasksInput, LeadUncheckedCreateWithoutTasksInput>
    connectOrCreate?: LeadCreateOrConnectWithoutTasksInput
    upsert?: LeadUpsertWithoutTasksInput
    disconnect?: LeadWhereInput | boolean
    delete?: LeadWhereInput | boolean
    connect?: LeadWhereUniqueInput
    update?: XOR<XOR<LeadUpdateToOneWithWhereWithoutTasksInput, LeadUpdateWithoutTasksInput>, LeadUncheckedUpdateWithoutTasksInput>
  }

  export type SectionCreateNestedManyWithoutPageInput = {
    create?: XOR<SectionCreateWithoutPageInput, SectionUncheckedCreateWithoutPageInput> | SectionCreateWithoutPageInput[] | SectionUncheckedCreateWithoutPageInput[]
    connectOrCreate?: SectionCreateOrConnectWithoutPageInput | SectionCreateOrConnectWithoutPageInput[]
    createMany?: SectionCreateManyPageInputEnvelope
    connect?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
  }

  export type SectionUncheckedCreateNestedManyWithoutPageInput = {
    create?: XOR<SectionCreateWithoutPageInput, SectionUncheckedCreateWithoutPageInput> | SectionCreateWithoutPageInput[] | SectionUncheckedCreateWithoutPageInput[]
    connectOrCreate?: SectionCreateOrConnectWithoutPageInput | SectionCreateOrConnectWithoutPageInput[]
    createMany?: SectionCreateManyPageInputEnvelope
    connect?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
  }

  export type SectionUpdateManyWithoutPageNestedInput = {
    create?: XOR<SectionCreateWithoutPageInput, SectionUncheckedCreateWithoutPageInput> | SectionCreateWithoutPageInput[] | SectionUncheckedCreateWithoutPageInput[]
    connectOrCreate?: SectionCreateOrConnectWithoutPageInput | SectionCreateOrConnectWithoutPageInput[]
    upsert?: SectionUpsertWithWhereUniqueWithoutPageInput | SectionUpsertWithWhereUniqueWithoutPageInput[]
    createMany?: SectionCreateManyPageInputEnvelope
    set?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    disconnect?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    delete?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    connect?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    update?: SectionUpdateWithWhereUniqueWithoutPageInput | SectionUpdateWithWhereUniqueWithoutPageInput[]
    updateMany?: SectionUpdateManyWithWhereWithoutPageInput | SectionUpdateManyWithWhereWithoutPageInput[]
    deleteMany?: SectionScalarWhereInput | SectionScalarWhereInput[]
  }

  export type SectionUncheckedUpdateManyWithoutPageNestedInput = {
    create?: XOR<SectionCreateWithoutPageInput, SectionUncheckedCreateWithoutPageInput> | SectionCreateWithoutPageInput[] | SectionUncheckedCreateWithoutPageInput[]
    connectOrCreate?: SectionCreateOrConnectWithoutPageInput | SectionCreateOrConnectWithoutPageInput[]
    upsert?: SectionUpsertWithWhereUniqueWithoutPageInput | SectionUpsertWithWhereUniqueWithoutPageInput[]
    createMany?: SectionCreateManyPageInputEnvelope
    set?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    disconnect?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    delete?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    connect?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    update?: SectionUpdateWithWhereUniqueWithoutPageInput | SectionUpdateWithWhereUniqueWithoutPageInput[]
    updateMany?: SectionUpdateManyWithWhereWithoutPageInput | SectionUpdateManyWithWhereWithoutPageInput[]
    deleteMany?: SectionScalarWhereInput | SectionScalarWhereInput[]
  }

  export type PageCreateNestedOneWithoutSectionsInput = {
    create?: XOR<PageCreateWithoutSectionsInput, PageUncheckedCreateWithoutSectionsInput>
    connectOrCreate?: PageCreateOrConnectWithoutSectionsInput
    connect?: PageWhereUniqueInput
  }

  export type PageUpdateOneRequiredWithoutSectionsNestedInput = {
    create?: XOR<PageCreateWithoutSectionsInput, PageUncheckedCreateWithoutSectionsInput>
    connectOrCreate?: PageCreateOrConnectWithoutSectionsInput
    upsert?: PageUpsertWithoutSectionsInput
    connect?: PageWhereUniqueInput
    update?: XOR<XOR<PageUpdateToOneWithWhereWithoutSectionsInput, PageUpdateWithoutSectionsInput>, PageUncheckedUpdateWithoutSectionsInput>
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type LeadCreateWithoutAgentInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    property?: PropertyCreateNestedOneWithoutLeadsInput
    calls?: CallCreateNestedManyWithoutLeadInput
    tasks?: TaskCreateNestedManyWithoutLeadInput
    appointments?: AppointmentCreateNestedManyWithoutLeadInput
    messages?: MessageCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutAgentInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    propertyId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    calls?: CallUncheckedCreateNestedManyWithoutLeadInput
    tasks?: TaskUncheckedCreateNestedManyWithoutLeadInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutLeadInput
    messages?: MessageUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutAgentInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutAgentInput, LeadUncheckedCreateWithoutAgentInput>
  }

  export type LeadCreateManyAgentInputEnvelope = {
    data: LeadCreateManyAgentInput | LeadCreateManyAgentInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutAgentInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    isImportant?: boolean
    dueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    list?: TaskListCreateNestedOneWithoutTasksInput
    lead?: LeadCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateWithoutAgentInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    isImportant?: boolean
    dueDate?: Date | string | null
    listId?: string | null
    leadId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateOrConnectWithoutAgentInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutAgentInput, TaskUncheckedCreateWithoutAgentInput>
  }

  export type TaskCreateManyAgentInputEnvelope = {
    data: TaskCreateManyAgentInput | TaskCreateManyAgentInput[]
    skipDuplicates?: boolean
  }

  export type AppointmentCreateWithoutAgentInput = {
    id?: string
    title: string
    date: Date | string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lead: LeadCreateNestedOneWithoutAppointmentsInput
  }

  export type AppointmentUncheckedCreateWithoutAgentInput = {
    id?: string
    title: string
    date: Date | string
    status?: string
    leadId: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentCreateOrConnectWithoutAgentInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutAgentInput, AppointmentUncheckedCreateWithoutAgentInput>
  }

  export type AppointmentCreateManyAgentInputEnvelope = {
    data: AppointmentCreateManyAgentInput | AppointmentCreateManyAgentInput[]
    skipDuplicates?: boolean
  }

  export type LeadUpsertWithWhereUniqueWithoutAgentInput = {
    where: LeadWhereUniqueInput
    update: XOR<LeadUpdateWithoutAgentInput, LeadUncheckedUpdateWithoutAgentInput>
    create: XOR<LeadCreateWithoutAgentInput, LeadUncheckedCreateWithoutAgentInput>
  }

  export type LeadUpdateWithWhereUniqueWithoutAgentInput = {
    where: LeadWhereUniqueInput
    data: XOR<LeadUpdateWithoutAgentInput, LeadUncheckedUpdateWithoutAgentInput>
  }

  export type LeadUpdateManyWithWhereWithoutAgentInput = {
    where: LeadScalarWhereInput
    data: XOR<LeadUpdateManyMutationInput, LeadUncheckedUpdateManyWithoutAgentInput>
  }

  export type LeadScalarWhereInput = {
    AND?: LeadScalarWhereInput | LeadScalarWhereInput[]
    OR?: LeadScalarWhereInput[]
    NOT?: LeadScalarWhereInput | LeadScalarWhereInput[]
    id?: StringFilter<"Lead"> | string
    name?: StringFilter<"Lead"> | string
    email?: StringNullableFilter<"Lead"> | string | null
    phone?: StringFilter<"Lead"> | string
    status?: StringFilter<"Lead"> | string
    budget?: DecimalNullableFilter<"Lead"> | Decimal | DecimalJsLike | number | string | null
    notes?: StringNullableFilter<"Lead"> | string | null
    source?: StringNullableFilter<"Lead"> | string | null
    preferences?: StringNullableFilter<"Lead"> | string | null
    requiresMortgage?: BoolFilter<"Lead"> | boolean
    agentId?: StringNullableFilter<"Lead"> | string | null
    propertyId?: StringNullableFilter<"Lead"> | string | null
    createdAt?: DateTimeFilter<"Lead"> | Date | string
    updatedAt?: DateTimeFilter<"Lead"> | Date | string
  }

  export type TaskUpsertWithWhereUniqueWithoutAgentInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutAgentInput, TaskUncheckedUpdateWithoutAgentInput>
    create: XOR<TaskCreateWithoutAgentInput, TaskUncheckedCreateWithoutAgentInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutAgentInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutAgentInput, TaskUncheckedUpdateWithoutAgentInput>
  }

  export type TaskUpdateManyWithWhereWithoutAgentInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutAgentInput>
  }

  export type TaskScalarWhereInput = {
    AND?: TaskScalarWhereInput | TaskScalarWhereInput[]
    OR?: TaskScalarWhereInput[]
    NOT?: TaskScalarWhereInput | TaskScalarWhereInput[]
    id?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    status?: StringFilter<"Task"> | string
    isImportant?: BoolFilter<"Task"> | boolean
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    assignedTo?: StringNullableFilter<"Task"> | string | null
    listId?: StringNullableFilter<"Task"> | string | null
    leadId?: StringNullableFilter<"Task"> | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
  }

  export type AppointmentUpsertWithWhereUniqueWithoutAgentInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutAgentInput, AppointmentUncheckedUpdateWithoutAgentInput>
    create: XOR<AppointmentCreateWithoutAgentInput, AppointmentUncheckedCreateWithoutAgentInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutAgentInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutAgentInput, AppointmentUncheckedUpdateWithoutAgentInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutAgentInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutAgentInput>
  }

  export type AppointmentScalarWhereInput = {
    AND?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    OR?: AppointmentScalarWhereInput[]
    NOT?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    id?: StringFilter<"Appointment"> | string
    title?: StringFilter<"Appointment"> | string
    date?: DateTimeFilter<"Appointment"> | Date | string
    status?: StringFilter<"Appointment"> | string
    leadId?: StringFilter<"Appointment"> | string
    agentId?: StringNullableFilter<"Appointment"> | string | null
    notes?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
  }

  export type LeadCreateWithoutPropertyInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: UserCreateNestedOneWithoutLeadsInput
    calls?: CallCreateNestedManyWithoutLeadInput
    tasks?: TaskCreateNestedManyWithoutLeadInput
    appointments?: AppointmentCreateNestedManyWithoutLeadInput
    messages?: MessageCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutPropertyInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    agentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    calls?: CallUncheckedCreateNestedManyWithoutLeadInput
    tasks?: TaskUncheckedCreateNestedManyWithoutLeadInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutLeadInput
    messages?: MessageUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutPropertyInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutPropertyInput, LeadUncheckedCreateWithoutPropertyInput>
  }

  export type LeadCreateManyPropertyInputEnvelope = {
    data: LeadCreateManyPropertyInput | LeadCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type LeadUpsertWithWhereUniqueWithoutPropertyInput = {
    where: LeadWhereUniqueInput
    update: XOR<LeadUpdateWithoutPropertyInput, LeadUncheckedUpdateWithoutPropertyInput>
    create: XOR<LeadCreateWithoutPropertyInput, LeadUncheckedCreateWithoutPropertyInput>
  }

  export type LeadUpdateWithWhereUniqueWithoutPropertyInput = {
    where: LeadWhereUniqueInput
    data: XOR<LeadUpdateWithoutPropertyInput, LeadUncheckedUpdateWithoutPropertyInput>
  }

  export type LeadUpdateManyWithWhereWithoutPropertyInput = {
    where: LeadScalarWhereInput
    data: XOR<LeadUpdateManyMutationInput, LeadUncheckedUpdateManyWithoutPropertyInput>
  }

  export type UserCreateWithoutLeadsInput = {
    id?: string
    email: string
    name: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: TaskCreateNestedManyWithoutAgentInput
    appointments?: AppointmentCreateNestedManyWithoutAgentInput
  }

  export type UserUncheckedCreateWithoutLeadsInput = {
    id?: string
    email: string
    name: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: TaskUncheckedCreateNestedManyWithoutAgentInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutAgentInput
  }

  export type UserCreateOrConnectWithoutLeadsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLeadsInput, UserUncheckedCreateWithoutLeadsInput>
  }

  export type PropertyCreateWithoutLeadsInput = {
    id?: string
    title: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    minPrice?: Decimal | DecimalJsLike | number | string | null
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    type: string
    status?: string
    location: string
    bedrooms?: number | null
    bathrooms?: number | null
    area?: number | null
    availableUnits?: number | null
    deliveryDate?: string | null
    images?: string | null
    presentations?: string | null
    nearbyPlaces?: string | null
    dynamicFeatures?: string | null
    independentUnit?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ownerName?: string | null
    ownerPhone?: string | null
    ownerEmail?: string | null
    ownerNotes?: string | null
  }

  export type PropertyUncheckedCreateWithoutLeadsInput = {
    id?: string
    title: string
    description?: string | null
    price: Decimal | DecimalJsLike | number | string
    minPrice?: Decimal | DecimalJsLike | number | string | null
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    type: string
    status?: string
    location: string
    bedrooms?: number | null
    bathrooms?: number | null
    area?: number | null
    availableUnits?: number | null
    deliveryDate?: string | null
    images?: string | null
    presentations?: string | null
    nearbyPlaces?: string | null
    dynamicFeatures?: string | null
    independentUnit?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ownerName?: string | null
    ownerPhone?: string | null
    ownerEmail?: string | null
    ownerNotes?: string | null
  }

  export type PropertyCreateOrConnectWithoutLeadsInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutLeadsInput, PropertyUncheckedCreateWithoutLeadsInput>
  }

  export type CallCreateWithoutLeadInput = {
    id?: string
    duration: number
    audioUrl?: string | null
    transcription?: string | null
    summary?: string | null
    mainTopic?: string | null
    keyPoints?: string | null
    commitments?: string | null
    sentiment?: string | null
    createdAt?: Date | string
  }

  export type CallUncheckedCreateWithoutLeadInput = {
    id?: string
    duration: number
    audioUrl?: string | null
    transcription?: string | null
    summary?: string | null
    mainTopic?: string | null
    keyPoints?: string | null
    commitments?: string | null
    sentiment?: string | null
    createdAt?: Date | string
  }

  export type CallCreateOrConnectWithoutLeadInput = {
    where: CallWhereUniqueInput
    create: XOR<CallCreateWithoutLeadInput, CallUncheckedCreateWithoutLeadInput>
  }

  export type CallCreateManyLeadInputEnvelope = {
    data: CallCreateManyLeadInput | CallCreateManyLeadInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutLeadInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    isImportant?: boolean
    dueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: UserCreateNestedOneWithoutTasksInput
    list?: TaskListCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateWithoutLeadInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    isImportant?: boolean
    dueDate?: Date | string | null
    assignedTo?: string | null
    listId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateOrConnectWithoutLeadInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutLeadInput, TaskUncheckedCreateWithoutLeadInput>
  }

  export type TaskCreateManyLeadInputEnvelope = {
    data: TaskCreateManyLeadInput | TaskCreateManyLeadInput[]
    skipDuplicates?: boolean
  }

  export type AppointmentCreateWithoutLeadInput = {
    id?: string
    title: string
    date: Date | string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: UserCreateNestedOneWithoutAppointmentsInput
  }

  export type AppointmentUncheckedCreateWithoutLeadInput = {
    id?: string
    title: string
    date: Date | string
    status?: string
    agentId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentCreateOrConnectWithoutLeadInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutLeadInput, AppointmentUncheckedCreateWithoutLeadInput>
  }

  export type AppointmentCreateManyLeadInputEnvelope = {
    data: AppointmentCreateManyLeadInput | AppointmentCreateManyLeadInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutLeadInput = {
    id?: string
    content: string
    fromBot?: boolean
    createdAt?: Date | string
  }

  export type MessageUncheckedCreateWithoutLeadInput = {
    id?: string
    content: string
    fromBot?: boolean
    createdAt?: Date | string
  }

  export type MessageCreateOrConnectWithoutLeadInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutLeadInput, MessageUncheckedCreateWithoutLeadInput>
  }

  export type MessageCreateManyLeadInputEnvelope = {
    data: MessageCreateManyLeadInput | MessageCreateManyLeadInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutLeadsInput = {
    update: XOR<UserUpdateWithoutLeadsInput, UserUncheckedUpdateWithoutLeadsInput>
    create: XOR<UserCreateWithoutLeadsInput, UserUncheckedCreateWithoutLeadsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLeadsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLeadsInput, UserUncheckedUpdateWithoutLeadsInput>
  }

  export type UserUpdateWithoutLeadsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUpdateManyWithoutAgentNestedInput
    appointments?: AppointmentUpdateManyWithoutAgentNestedInput
  }

  export type UserUncheckedUpdateWithoutLeadsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUncheckedUpdateManyWithoutAgentNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type PropertyUpsertWithoutLeadsInput = {
    update: XOR<PropertyUpdateWithoutLeadsInput, PropertyUncheckedUpdateWithoutLeadsInput>
    create: XOR<PropertyCreateWithoutLeadsInput, PropertyUncheckedCreateWithoutLeadsInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutLeadsInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutLeadsInput, PropertyUncheckedUpdateWithoutLeadsInput>
  }

  export type PropertyUpdateWithoutLeadsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    availableUnits?: NullableIntFieldUpdateOperationsInput | number | null
    deliveryDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: NullableStringFieldUpdateOperationsInput | string | null
    presentations?: NullableStringFieldUpdateOperationsInput | string | null
    nearbyPlaces?: NullableStringFieldUpdateOperationsInput | string | null
    dynamicFeatures?: NullableStringFieldUpdateOperationsInput | string | null
    independentUnit?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PropertyUncheckedUpdateWithoutLeadsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    minPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    bedrooms?: NullableIntFieldUpdateOperationsInput | number | null
    bathrooms?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    availableUnits?: NullableIntFieldUpdateOperationsInput | number | null
    deliveryDate?: NullableStringFieldUpdateOperationsInput | string | null
    images?: NullableStringFieldUpdateOperationsInput | string | null
    presentations?: NullableStringFieldUpdateOperationsInput | string | null
    nearbyPlaces?: NullableStringFieldUpdateOperationsInput | string | null
    dynamicFeatures?: NullableStringFieldUpdateOperationsInput | string | null
    independentUnit?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerNotes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CallUpsertWithWhereUniqueWithoutLeadInput = {
    where: CallWhereUniqueInput
    update: XOR<CallUpdateWithoutLeadInput, CallUncheckedUpdateWithoutLeadInput>
    create: XOR<CallCreateWithoutLeadInput, CallUncheckedCreateWithoutLeadInput>
  }

  export type CallUpdateWithWhereUniqueWithoutLeadInput = {
    where: CallWhereUniqueInput
    data: XOR<CallUpdateWithoutLeadInput, CallUncheckedUpdateWithoutLeadInput>
  }

  export type CallUpdateManyWithWhereWithoutLeadInput = {
    where: CallScalarWhereInput
    data: XOR<CallUpdateManyMutationInput, CallUncheckedUpdateManyWithoutLeadInput>
  }

  export type CallScalarWhereInput = {
    AND?: CallScalarWhereInput | CallScalarWhereInput[]
    OR?: CallScalarWhereInput[]
    NOT?: CallScalarWhereInput | CallScalarWhereInput[]
    id?: StringFilter<"Call"> | string
    leadId?: StringFilter<"Call"> | string
    duration?: IntFilter<"Call"> | number
    audioUrl?: StringNullableFilter<"Call"> | string | null
    transcription?: StringNullableFilter<"Call"> | string | null
    summary?: StringNullableFilter<"Call"> | string | null
    mainTopic?: StringNullableFilter<"Call"> | string | null
    keyPoints?: StringNullableFilter<"Call"> | string | null
    commitments?: StringNullableFilter<"Call"> | string | null
    sentiment?: StringNullableFilter<"Call"> | string | null
    createdAt?: DateTimeFilter<"Call"> | Date | string
  }

  export type TaskUpsertWithWhereUniqueWithoutLeadInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutLeadInput, TaskUncheckedUpdateWithoutLeadInput>
    create: XOR<TaskCreateWithoutLeadInput, TaskUncheckedCreateWithoutLeadInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutLeadInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutLeadInput, TaskUncheckedUpdateWithoutLeadInput>
  }

  export type TaskUpdateManyWithWhereWithoutLeadInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutLeadInput>
  }

  export type AppointmentUpsertWithWhereUniqueWithoutLeadInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutLeadInput, AppointmentUncheckedUpdateWithoutLeadInput>
    create: XOR<AppointmentCreateWithoutLeadInput, AppointmentUncheckedCreateWithoutLeadInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutLeadInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutLeadInput, AppointmentUncheckedUpdateWithoutLeadInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutLeadInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutLeadInput>
  }

  export type MessageUpsertWithWhereUniqueWithoutLeadInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutLeadInput, MessageUncheckedUpdateWithoutLeadInput>
    create: XOR<MessageCreateWithoutLeadInput, MessageUncheckedCreateWithoutLeadInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutLeadInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutLeadInput, MessageUncheckedUpdateWithoutLeadInput>
  }

  export type MessageUpdateManyWithWhereWithoutLeadInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutLeadInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    fromBot?: BoolFilter<"Message"> | boolean
    leadId?: StringFilter<"Message"> | string
    createdAt?: DateTimeFilter<"Message"> | Date | string
  }

  export type LeadCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: UserCreateNestedOneWithoutLeadsInput
    property?: PropertyCreateNestedOneWithoutLeadsInput
    calls?: CallCreateNestedManyWithoutLeadInput
    tasks?: TaskCreateNestedManyWithoutLeadInput
    messages?: MessageCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    agentId?: string | null
    propertyId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    calls?: CallUncheckedCreateNestedManyWithoutLeadInput
    tasks?: TaskUncheckedCreateNestedManyWithoutLeadInput
    messages?: MessageUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutAppointmentsInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutAppointmentsInput, LeadUncheckedCreateWithoutAppointmentsInput>
  }

  export type UserCreateWithoutAppointmentsInput = {
    id?: string
    email: string
    name: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadCreateNestedManyWithoutAgentInput
    tasks?: TaskCreateNestedManyWithoutAgentInput
  }

  export type UserUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    email: string
    name: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadUncheckedCreateNestedManyWithoutAgentInput
    tasks?: TaskUncheckedCreateNestedManyWithoutAgentInput
  }

  export type UserCreateOrConnectWithoutAppointmentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAppointmentsInput, UserUncheckedCreateWithoutAppointmentsInput>
  }

  export type LeadUpsertWithoutAppointmentsInput = {
    update: XOR<LeadUpdateWithoutAppointmentsInput, LeadUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<LeadCreateWithoutAppointmentsInput, LeadUncheckedCreateWithoutAppointmentsInput>
    where?: LeadWhereInput
  }

  export type LeadUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: LeadWhereInput
    data: XOR<LeadUpdateWithoutAppointmentsInput, LeadUncheckedUpdateWithoutAppointmentsInput>
  }

  export type LeadUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: UserUpdateOneWithoutLeadsNestedInput
    property?: PropertyUpdateOneWithoutLeadsNestedInput
    calls?: CallUpdateManyWithoutLeadNestedInput
    tasks?: TaskUpdateManyWithoutLeadNestedInput
    messages?: MessageUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    propertyId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    calls?: CallUncheckedUpdateManyWithoutLeadNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutLeadNestedInput
    messages?: MessageUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type UserUpsertWithoutAppointmentsInput = {
    update: XOR<UserUpdateWithoutAppointmentsInput, UserUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<UserCreateWithoutAppointmentsInput, UserUncheckedCreateWithoutAppointmentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAppointmentsInput, UserUncheckedUpdateWithoutAppointmentsInput>
  }

  export type UserUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUpdateManyWithoutAgentNestedInput
    tasks?: TaskUpdateManyWithoutAgentNestedInput
  }

  export type UserUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUncheckedUpdateManyWithoutAgentNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type LeadCreateWithoutMessagesInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: UserCreateNestedOneWithoutLeadsInput
    property?: PropertyCreateNestedOneWithoutLeadsInput
    calls?: CallCreateNestedManyWithoutLeadInput
    tasks?: TaskCreateNestedManyWithoutLeadInput
    appointments?: AppointmentCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutMessagesInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    agentId?: string | null
    propertyId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    calls?: CallUncheckedCreateNestedManyWithoutLeadInput
    tasks?: TaskUncheckedCreateNestedManyWithoutLeadInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutMessagesInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutMessagesInput, LeadUncheckedCreateWithoutMessagesInput>
  }

  export type LeadUpsertWithoutMessagesInput = {
    update: XOR<LeadUpdateWithoutMessagesInput, LeadUncheckedUpdateWithoutMessagesInput>
    create: XOR<LeadCreateWithoutMessagesInput, LeadUncheckedCreateWithoutMessagesInput>
    where?: LeadWhereInput
  }

  export type LeadUpdateToOneWithWhereWithoutMessagesInput = {
    where?: LeadWhereInput
    data: XOR<LeadUpdateWithoutMessagesInput, LeadUncheckedUpdateWithoutMessagesInput>
  }

  export type LeadUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: UserUpdateOneWithoutLeadsNestedInput
    property?: PropertyUpdateOneWithoutLeadsNestedInput
    calls?: CallUpdateManyWithoutLeadNestedInput
    tasks?: TaskUpdateManyWithoutLeadNestedInput
    appointments?: AppointmentUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    propertyId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    calls?: CallUncheckedUpdateManyWithoutLeadNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutLeadNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type LeadCreateWithoutCallsInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: UserCreateNestedOneWithoutLeadsInput
    property?: PropertyCreateNestedOneWithoutLeadsInput
    tasks?: TaskCreateNestedManyWithoutLeadInput
    appointments?: AppointmentCreateNestedManyWithoutLeadInput
    messages?: MessageCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutCallsInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    agentId?: string | null
    propertyId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: TaskUncheckedCreateNestedManyWithoutLeadInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutLeadInput
    messages?: MessageUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutCallsInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutCallsInput, LeadUncheckedCreateWithoutCallsInput>
  }

  export type LeadUpsertWithoutCallsInput = {
    update: XOR<LeadUpdateWithoutCallsInput, LeadUncheckedUpdateWithoutCallsInput>
    create: XOR<LeadCreateWithoutCallsInput, LeadUncheckedCreateWithoutCallsInput>
    where?: LeadWhereInput
  }

  export type LeadUpdateToOneWithWhereWithoutCallsInput = {
    where?: LeadWhereInput
    data: XOR<LeadUpdateWithoutCallsInput, LeadUncheckedUpdateWithoutCallsInput>
  }

  export type LeadUpdateWithoutCallsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: UserUpdateOneWithoutLeadsNestedInput
    property?: PropertyUpdateOneWithoutLeadsNestedInput
    tasks?: TaskUpdateManyWithoutLeadNestedInput
    appointments?: AppointmentUpdateManyWithoutLeadNestedInput
    messages?: MessageUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutCallsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    propertyId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUncheckedUpdateManyWithoutLeadNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutLeadNestedInput
    messages?: MessageUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type TaskCreateWithoutListInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    isImportant?: boolean
    dueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: UserCreateNestedOneWithoutTasksInput
    lead?: LeadCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateWithoutListInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    isImportant?: boolean
    dueDate?: Date | string | null
    assignedTo?: string | null
    leadId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateOrConnectWithoutListInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutListInput, TaskUncheckedCreateWithoutListInput>
  }

  export type TaskCreateManyListInputEnvelope = {
    data: TaskCreateManyListInput | TaskCreateManyListInput[]
    skipDuplicates?: boolean
  }

  export type TaskUpsertWithWhereUniqueWithoutListInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutListInput, TaskUncheckedUpdateWithoutListInput>
    create: XOR<TaskCreateWithoutListInput, TaskUncheckedCreateWithoutListInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutListInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutListInput, TaskUncheckedUpdateWithoutListInput>
  }

  export type TaskUpdateManyWithWhereWithoutListInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutListInput>
  }

  export type UserCreateWithoutTasksInput = {
    id?: string
    email: string
    name: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadCreateNestedManyWithoutAgentInput
    appointments?: AppointmentCreateNestedManyWithoutAgentInput
  }

  export type UserUncheckedCreateWithoutTasksInput = {
    id?: string
    email: string
    name: string
    role?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    leads?: LeadUncheckedCreateNestedManyWithoutAgentInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutAgentInput
  }

  export type UserCreateOrConnectWithoutTasksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
  }

  export type TaskListCreateWithoutTasksInput = {
    id?: string
    name: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskListUncheckedCreateWithoutTasksInput = {
    id?: string
    name: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskListCreateOrConnectWithoutTasksInput = {
    where: TaskListWhereUniqueInput
    create: XOR<TaskListCreateWithoutTasksInput, TaskListUncheckedCreateWithoutTasksInput>
  }

  export type LeadCreateWithoutTasksInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    agent?: UserCreateNestedOneWithoutLeadsInput
    property?: PropertyCreateNestedOneWithoutLeadsInput
    calls?: CallCreateNestedManyWithoutLeadInput
    appointments?: AppointmentCreateNestedManyWithoutLeadInput
    messages?: MessageCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutTasksInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    agentId?: string | null
    propertyId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    calls?: CallUncheckedCreateNestedManyWithoutLeadInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutLeadInput
    messages?: MessageUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutTasksInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutTasksInput, LeadUncheckedCreateWithoutTasksInput>
  }

  export type UserUpsertWithoutTasksInput = {
    update: XOR<UserUpdateWithoutTasksInput, UserUncheckedUpdateWithoutTasksInput>
    create: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTasksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTasksInput, UserUncheckedUpdateWithoutTasksInput>
  }

  export type UserUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUpdateManyWithoutAgentNestedInput
    appointments?: AppointmentUpdateManyWithoutAgentNestedInput
  }

  export type UserUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leads?: LeadUncheckedUpdateManyWithoutAgentNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type TaskListUpsertWithoutTasksInput = {
    update: XOR<TaskListUpdateWithoutTasksInput, TaskListUncheckedUpdateWithoutTasksInput>
    create: XOR<TaskListCreateWithoutTasksInput, TaskListUncheckedCreateWithoutTasksInput>
    where?: TaskListWhereInput
  }

  export type TaskListUpdateToOneWithWhereWithoutTasksInput = {
    where?: TaskListWhereInput
    data: XOR<TaskListUpdateWithoutTasksInput, TaskListUncheckedUpdateWithoutTasksInput>
  }

  export type TaskListUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskListUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadUpsertWithoutTasksInput = {
    update: XOR<LeadUpdateWithoutTasksInput, LeadUncheckedUpdateWithoutTasksInput>
    create: XOR<LeadCreateWithoutTasksInput, LeadUncheckedCreateWithoutTasksInput>
    where?: LeadWhereInput
  }

  export type LeadUpdateToOneWithWhereWithoutTasksInput = {
    where?: LeadWhereInput
    data: XOR<LeadUpdateWithoutTasksInput, LeadUncheckedUpdateWithoutTasksInput>
  }

  export type LeadUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: UserUpdateOneWithoutLeadsNestedInput
    property?: PropertyUpdateOneWithoutLeadsNestedInput
    calls?: CallUpdateManyWithoutLeadNestedInput
    appointments?: AppointmentUpdateManyWithoutLeadNestedInput
    messages?: MessageUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    propertyId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    calls?: CallUncheckedUpdateManyWithoutLeadNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutLeadNestedInput
    messages?: MessageUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type SectionCreateWithoutPageInput = {
    id?: string
    type: string
    order?: number
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SectionUncheckedCreateWithoutPageInput = {
    id?: string
    type: string
    order?: number
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SectionCreateOrConnectWithoutPageInput = {
    where: SectionWhereUniqueInput
    create: XOR<SectionCreateWithoutPageInput, SectionUncheckedCreateWithoutPageInput>
  }

  export type SectionCreateManyPageInputEnvelope = {
    data: SectionCreateManyPageInput | SectionCreateManyPageInput[]
    skipDuplicates?: boolean
  }

  export type SectionUpsertWithWhereUniqueWithoutPageInput = {
    where: SectionWhereUniqueInput
    update: XOR<SectionUpdateWithoutPageInput, SectionUncheckedUpdateWithoutPageInput>
    create: XOR<SectionCreateWithoutPageInput, SectionUncheckedCreateWithoutPageInput>
  }

  export type SectionUpdateWithWhereUniqueWithoutPageInput = {
    where: SectionWhereUniqueInput
    data: XOR<SectionUpdateWithoutPageInput, SectionUncheckedUpdateWithoutPageInput>
  }

  export type SectionUpdateManyWithWhereWithoutPageInput = {
    where: SectionScalarWhereInput
    data: XOR<SectionUpdateManyMutationInput, SectionUncheckedUpdateManyWithoutPageInput>
  }

  export type SectionScalarWhereInput = {
    AND?: SectionScalarWhereInput | SectionScalarWhereInput[]
    OR?: SectionScalarWhereInput[]
    NOT?: SectionScalarWhereInput | SectionScalarWhereInput[]
    id?: StringFilter<"Section"> | string
    pageId?: StringFilter<"Section"> | string
    type?: StringFilter<"Section"> | string
    order?: IntFilter<"Section"> | number
    content?: StringFilter<"Section"> | string
    createdAt?: DateTimeFilter<"Section"> | Date | string
    updatedAt?: DateTimeFilter<"Section"> | Date | string
  }

  export type PageCreateWithoutSectionsInput = {
    id?: string
    title: string
    slug: string
    isPublished?: boolean
    metaTitle?: string | null
    metaDesc?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PageUncheckedCreateWithoutSectionsInput = {
    id?: string
    title: string
    slug: string
    isPublished?: boolean
    metaTitle?: string | null
    metaDesc?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PageCreateOrConnectWithoutSectionsInput = {
    where: PageWhereUniqueInput
    create: XOR<PageCreateWithoutSectionsInput, PageUncheckedCreateWithoutSectionsInput>
  }

  export type PageUpsertWithoutSectionsInput = {
    update: XOR<PageUpdateWithoutSectionsInput, PageUncheckedUpdateWithoutSectionsInput>
    create: XOR<PageCreateWithoutSectionsInput, PageUncheckedCreateWithoutSectionsInput>
    where?: PageWhereInput
  }

  export type PageUpdateToOneWithWhereWithoutSectionsInput = {
    where?: PageWhereInput
    data: XOR<PageUpdateWithoutSectionsInput, PageUncheckedUpdateWithoutSectionsInput>
  }

  export type PageUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    metaTitle?: NullableStringFieldUpdateOperationsInput | string | null
    metaDesc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageUncheckedUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    metaTitle?: NullableStringFieldUpdateOperationsInput | string | null
    metaDesc?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadCreateManyAgentInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    propertyId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateManyAgentInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    isImportant?: boolean
    dueDate?: Date | string | null
    listId?: string | null
    leadId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentCreateManyAgentInput = {
    id?: string
    title: string
    date: Date | string
    status?: string
    leadId: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeadUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneWithoutLeadsNestedInput
    calls?: CallUpdateManyWithoutLeadNestedInput
    tasks?: TaskUpdateManyWithoutLeadNestedInput
    appointments?: AppointmentUpdateManyWithoutLeadNestedInput
    messages?: MessageUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    propertyId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    calls?: CallUncheckedUpdateManyWithoutLeadNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutLeadNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutLeadNestedInput
    messages?: MessageUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateManyWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    propertyId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isImportant?: BoolFieldUpdateOperationsInput | boolean
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    list?: TaskListUpdateOneWithoutTasksNestedInput
    lead?: LeadUpdateOneWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isImportant?: BoolFieldUpdateOperationsInput | boolean
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    listId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isImportant?: BoolFieldUpdateOperationsInput | boolean
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    listId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lead?: LeadUpdateOneRequiredWithoutAppointmentsNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    leadId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateManyWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    leadId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadCreateManyPropertyInput = {
    id?: string
    name: string
    email?: string | null
    phone: string
    status?: string
    budget?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    source?: string | null
    preferences?: string | null
    requiresMortgage?: boolean
    agentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeadUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: UserUpdateOneWithoutLeadsNestedInput
    calls?: CallUpdateManyWithoutLeadNestedInput
    tasks?: TaskUpdateManyWithoutLeadNestedInput
    appointments?: AppointmentUpdateManyWithoutLeadNestedInput
    messages?: MessageUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    calls?: CallUncheckedUpdateManyWithoutLeadNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutLeadNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutLeadNestedInput
    messages?: MessageUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    budget?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: NullableStringFieldUpdateOperationsInput | string | null
    requiresMortgage?: BoolFieldUpdateOperationsInput | boolean
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallCreateManyLeadInput = {
    id?: string
    duration: number
    audioUrl?: string | null
    transcription?: string | null
    summary?: string | null
    mainTopic?: string | null
    keyPoints?: string | null
    commitments?: string | null
    sentiment?: string | null
    createdAt?: Date | string
  }

  export type TaskCreateManyLeadInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    isImportant?: boolean
    dueDate?: Date | string | null
    assignedTo?: string | null
    listId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentCreateManyLeadInput = {
    id?: string
    title: string
    date: Date | string
    status?: string
    agentId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageCreateManyLeadInput = {
    id?: string
    content: string
    fromBot?: boolean
    createdAt?: Date | string
  }

  export type CallUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    mainTopic?: NullableStringFieldUpdateOperationsInput | string | null
    keyPoints?: NullableStringFieldUpdateOperationsInput | string | null
    commitments?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallUncheckedUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    mainTopic?: NullableStringFieldUpdateOperationsInput | string | null
    keyPoints?: NullableStringFieldUpdateOperationsInput | string | null
    commitments?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallUncheckedUpdateManyWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    mainTopic?: NullableStringFieldUpdateOperationsInput | string | null
    keyPoints?: NullableStringFieldUpdateOperationsInput | string | null
    commitments?: NullableStringFieldUpdateOperationsInput | string | null
    sentiment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isImportant?: BoolFieldUpdateOperationsInput | boolean
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: UserUpdateOneWithoutTasksNestedInput
    list?: TaskListUpdateOneWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isImportant?: BoolFieldUpdateOperationsInput | boolean
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    listId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isImportant?: BoolFieldUpdateOperationsInput | boolean
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    listId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: UserUpdateOneWithoutAppointmentsNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateManyWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    fromBot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    fromBot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    fromBot?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCreateManyListInput = {
    id?: string
    title: string
    description?: string | null
    status?: string
    isImportant?: boolean
    dueDate?: Date | string | null
    assignedTo?: string | null
    leadId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskUpdateWithoutListInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isImportant?: BoolFieldUpdateOperationsInput | boolean
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: UserUpdateOneWithoutTasksNestedInput
    lead?: LeadUpdateOneWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutListInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isImportant?: BoolFieldUpdateOperationsInput | boolean
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyWithoutListInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isImportant?: BoolFieldUpdateOperationsInput | boolean
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SectionCreateManyPageInput = {
    id?: string
    type: string
    order?: number
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SectionUpdateWithoutPageInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SectionUncheckedUpdateWithoutPageInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SectionUncheckedUpdateManyWithoutPageInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}