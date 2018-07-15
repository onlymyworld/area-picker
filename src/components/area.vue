<template>
  <div class="hello">
  	<v-form :model="customForm" :rules="customRules" ref='customRuleForm'>
  		<area-picker
	    	@onchange ="getChoosed" 
	    	mode="0"
	    	prop="address"
	    	v-model="customForm.address"
    	></area-picker>
    	
    	<area-picker
	    	@onload = "getAreas"
	    	@onchange ="getChoosed" 
	    	:initlist="initlist" 
	    	:initShowList="initShowList" 
	    	mode="2"
	    	clue="id"
	    	label="area_name">
    	</area-picker>

    	<area-picker
	    	@onload = "getAllAreas"
	    	@onchange ="getChoosed"
	    	mode="1"
	    	pid ="area_parent_id" 
	    	:initlist="initlist_1"
	    	:initShowList="initShowList2"
	    	child="child"
	    	clue="id"
	    	label="area_name">
    	</area-picker>
    	
    	<v-button type="primary" style="margin-right:10px" @click.prevent="submitForm('customRuleForm')">提交</v-button>
  	</v-form>
    
  </div>
</template>

<script>
import areaPicker from "./area-picker";
export default {
	data() {
		var validateAddress = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请选择地址！"));
			} else {
				callback();
			}
		};
		return {
			customForm: {
				address: "",
				age: ""
			},
			customRules: {
				address: [
					{
						required: true,
						message: "请选择地址"
					},
					{
						validator: validateAddress
					}
				]
			},
			mode: 0, //0:使用默认值，1:一次性加载所有值，2:分块加载
			initShowList: [
				{ id: "610000", area_name: "陕西省" },
				{ id: "610700", area_name: "汉中市" },
				{ id: "610724", area_name: "西乡县" }
			],
			initShowList2: [
				{ id: "510000", area_name: "四川省" },
				{ id: "511700", area_name: "达州市" }
			],
			initlist: [],
			initlist_1: []
		};
	},
	created() {},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					alert("submit!");
				} else {
					return false;
				}
			});
		},
		getChoosed(val) {
			console.log(val);
		},
		async getAllAreas() {
			fetch("http://localhost:8081/getAll", {
				method: "get"
			})
				.then(res => {
					return res.json();
				})
				.then(data => {
					this.initlist_1 = data;
				});
		},

		async getAreas(opts) {
			return fetch("http://localhost:8081/getAreas", {
				method: "post",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify(opts)
			})
				.then(res => {
					return res.json();
				})
				.then(data => {
					this.initlist = data;
				});

			// this.initlist = await window.$http.post(
			// 	"/common/searchregion",
			// 	opts
			// );
		}
	},
	components: { "area-picker": areaPicker }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
	font-weight: normal;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
</style>
