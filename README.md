# area-picker

> area-picker not only you can use default data,but alse write your onload method; it can work with form-item of vue-beauty component;

## 安装

```bash
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

可以获取通过 onchange 方法，获取更改后的数据。

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

注意：mode = 1,可以使用 v-model 获取修改后的数据；

```
<template>
    <area-picker
	    	@onload = "loadData"
	    	@onchange ="getChoosed"
	    	mode="1"
	    	:initlist="initlist"
	    	:initShowList="initShowList",
	    	v-model="initShowList"
	    	label="省市区">
    </area-picker>
</template>

<script>
export default {
	data() {
		return {
		    initShowList: [
				{ id: "610000", area_name: "陕西省" },
				{ id: "610700", area_name: "汉中市" },
				{ id: "610724", area_name: "西乡县" }
			],
			initList:[]
		};
	},
	methods: {
		getChoosed(val) {
			console.log(val);
		},
		loadData(opts){
		    //数据请求成功后
		    this.initList = result;
		}
	}
};
</script>
```

##### 分块加载数据

注意：设置 mode=2;

```
<template>
    <area-picker
	    	@onload = "loadData"
	    	@onchange ="getChoosed"
	    	:initlist="initlist"
	    	mode="2"
	    	label="地址">
    	</area-picker>
</template>

<script>
export default {
	data() {
		return {
			initList:[]
		};
	},
	methods: {
		getChoosed(val) {
			console.log(val);
		},
		loadData(opts){
		    //数据请求成功后
		    this.initList = result;
		}
	}
};
</script>
```

##### 兼容 form-item

注意：vbeauty = true; prop 设置成关联字段名称，v-model 设置成关联字段，具体用法和 form-item 用法一样。

```
<template>
    <v-form :model="customForm" :rules="customRules" ref='customRuleForm'>
        <area-picker
	    	@onchange ="getChoosed"
	    	:vbeauty=true
	    	prop="address"
	    	v-model="customForm.address"
    	></area-picker>
    </v-form>
</template>

<script>
export default {
	data() {
	    //可参照form-item设置自定义验证规则
		return {
		    customForm: {
				address: "",
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
		}
	}
};
</script>
```

#### API

##### area-picker props

| 参数         | 说明                                                    | 类型    | 默认值    |
| ------------ | ------------------------------------------------------- | ------- | --------- |
| mode         | 0:使用默认数据；1:一次加载所有数据；2:分块加载数据      | Number  | 0         |
| clue         | 显示值                                                  | String  | id        |
| name         | 对象显示名                                              | String  | area_name |
| label        | 标签名                                                  | String  | "地址"    |
| initlist     | 数据：（分片/一次）请求数据                             | Array   | -         |
| initShowList | 设置默认值                                              | Array   | -         |
| pid          | 当一次性加载数据时，重组数据时的关联字段                | String  | parent_id |
| child        | 数据层级名称定义                                        | String  | child     |
| vbeauty      | 是否使用 form-item,如果为 true,则可以设置表单验证内容， | Boolean | false     |
| v-model      | 双向绑定数据【兼容 form-item 时需要】，                 | -       | -         |
| prop         | vbeauty = true 时，对应表单中的字段名称                 | String  | -         |

##### area-picker Method

| 事件     | 说明                                             | 参数  |
| -------- | ------------------------------------------------ | ----- |
| onload   | 用户自定义加载数据                               | -     |
| onchange | 选择的值发生变化的时候触发，默认返回选中区域数组 | value |
