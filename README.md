# area-picker

> area-picker not only you can use default data,but alse write your onload method; it can work with form-item of vue-beauty component;

## 安装

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

#### 使用指南
##### 使用默认数据,
可以获取通过onchange方法，获取更改后的数据。

```
<template>
    <area-picker @onchange="getChoosed"/>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		getChoosed(val) {
			console.log(val);
		}
	}
};
</script>
```

##### 一次性加载所有数据
注意：mode = 1,可以使用v-model获取修改后的数据；
```
<template>
    <area-picker
	    	:data = "getAreas"
	    	:mode=1
	    	child="child",
	    	pid="parent_id",
	    	orgdata={true}
	    	@onchange ="getChoosed">
    	</area-picker>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		getChoosed(val) {
			console.log(val);
		},
		async getAreas(){
		    //返回一个promise
		    return Promise
		}
	}
};
</script>
```


##### 分块加载数据
注意：设置mode=2;
```
<template>
    <area-picker
	    	:data = "getAreas"
	    	:mode=2
	    	@onchange ="getChoosed">
    	</area-picker>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		getChoosed(val) {
			console.log(val);
		},
		async getAreas(){
		    //返回一个promise
		    return Promise
		}
	}
};
</script>
```

##### 兼容form-item 
注意：vbeauty = true; prop设置成关联字段名称，v-model设置成关联字段，具体用法和form-item用法一样。
```
<template>
    <v-form :model="customForm" :rules="customRules" ref='customRuleForm'>
        <area-picker
	    	:data = "getAreas"
	    	:initShowList="customForm.address"
	    	:vbeauty=true
	    	:mode=2
	    	prop="address"
	    	v-model="customForm.address"
	    	@onchange ="getChoosed">
    	</area-picker>
    </v-form>
</template>

<script>
export default {
	data() {
	    //可参照form-item设置自定义验证规则
		return {
		    customForm: {
				[
					{ code: "360000", name: "江西省" },
					{ code: "360100", name: "南昌市" },
					{ code: "360101", name: "直辖区" }
				]
			},
			customRules: {
				address: [
					{
						required: true,
						message: "请选择地址"
					}
				]
			},
		};
	},
	methods: {
		getChoosed(val) {
			console.log(val);
		},
		async getAreas(){
		    //返回一个promise
		    return Promise
		}
	}
};
</script>
```



#### API
##### area-picker props

参数  | 说明 | 类型 | 默认值
---|---|---|---|
 mode | 0:使用默认数据；1:一次加载所有数据；2:分块加载数据 | Number | 0
 clue | 选项的id | String | id
 name | 选项的名称 | String | area_name
 label | 标签名 | String | "地址"
 initShowList | 设置默认值 | Array | -
 pid | 当一次性加载数据时，重组数据时的关联字段 | String | parent_id
 child | 数据层级名称 | String | child
 orgdata | 是否使用默认重组数据方法 | Boolean | false
 vbeauty | 是否使用form-item,如果为true,则可以设置表单验证内容 | Boolean | false
 v-model| 双向绑定数据【兼容form-item时需要】| - | -
 prop | form-item 的prop属性，配合vbeauty=true使用 | String | -
 
 
 
 
#####  area-picker Method

事件  | 说明 | 参数 
---|---|---|---|
onchange | 选择的值发生变化的时候触发，默认返回选中区域数组 | value



 
 
 
 
 
 
 


