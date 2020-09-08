/***
 * this file is to understand the basic concept of vue js
 * how vue2 achieve data binding
 */


 // this function is the basic one to test data hijacking
 // use Object.defineProperty
function defineReactive(obj, key, val) {
  Object.defineProperty(obj,key, {
    get() {
      console.log('get:', val)
      return val
    },
    set(newValue) {
      console.log('set:', newValue)
      if (newValue !== val) {
        val = newValue
      }
    }
  })
}

// test defineReactive
const foo = {}

defineReactive(foo, 'hi', 'yo')

foo.hi = 'check it out'

//-----------------------------------------------------------

// we could see that define reactive work
// but need to set the property one by one

// so let it auto hijacking an object
function observe(obj) {
  // check if obj is object
  if (typeof obj !== 'object' || obj == null) {
    return
  }
  Object.keys(obj)
    .forEach(key => {
      val = obj[key]
      defineReactive(obj, key, val)
    })
}

// test observe
const foo2 = {
  hi: 'yo',
  hi2: 'yo2'
}

observe(foo2)
foo2.hi2 // get
foo2.hi = 'yo3' // set

// after test, we could hijacking obj
// but the problem is that the new property we define will not be observed

//-----------------------------------------------------------
// for simple obj, above work
// what if the obj = { key: obj1}
// then above observe can't interate the obj1
// to solve that 

function defineReactive2(obj, key, val) {
  // we observe the val also 
  observe2(val)

  Object.defineProperty(obj,key, {
    get() {
      console.log('get:', val)
      return val
    },
    set(newValue) {
      if (newValue !== val) {
        console.log('set:', newValue)
        observe2(newValue) // if new set value is alse an object
        val = newValue
      }
    }
  })
}

function observe2(obj) {
  // check if obj is object
  if (typeof obj !== 'object' || obj == null) {

    return
  }
  Object.keys(obj)
    .forEach(key => {
      val = obj[key]
      defineReactive2(obj, key, val)
    })
}

// test defineReactive2
const foo3 = {
  hi: 'yo',
  hi2: {
    hi3: 'yo3'
  }
}

console.log('testing defineReactive2 .......')
observe2(foo3)
foo3.hi2.hi3
foo3.hi2.hi3 = 'hi4'

// 對於數組響應， vue 重寫原型
