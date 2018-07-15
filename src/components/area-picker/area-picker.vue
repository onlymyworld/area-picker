<template>
	 	<div class="ant-address">
	 		<v-form-item label="地址" required  :prop="prop" v-if="vbeauty" >
		 		<div class="ant-address__text" @click="toggleDropdown" >
		 			<v-input type="text" placeholder="请选择" size="middle" readonly v-bind="$attrs" :value="addressValue">
		 			</v-input>
					<span class="ant-address__clear" v-show="finish.length >= 2" @click.stop="clear"></span>
		 		</div>
	 		</v-form-item>
	 		<div class="ant-address__label" v-else>
	 			<div class="ant-address__label_inner">{{label}}：</div>
		 		<div class="ant-address__text ant-address__border ant-address__pad" @click="toggleDropdown" >
		 			<span>{{addressValue}}</span>
		 			<span class="ant-address__clear" v-show="finish.length >= 2" @click.stop="clear"></span>
		 		</div>
	 		</div>
	 		<div class="ant-address__masklayer" v-show="showPanel" @click="toggleDropdown"></div>
	 		<div class="ant-address__select" v-if="showPanel">
	            <ul class="ant-address__select-header">
	                <li v-for="(item, index) in current" @click="showCurrent(item, index)" :class=" index == currentIndex ? 'actived' : '' ">{{item[name] ? item[name]: item.name}}</li>
	            </ul>
	            <ul class="ant-address__select-content">
	            	<li class="loading" v-if="showList.length ==0 ">加载中。。。</li>
	                <li v-for="item in showList" @click="getNext(item)" :class="current[currentIndex][clue] == item[clue] ? 'actived' : '' ">{{item[name] ? item[name] : item}}</li>
	            </ul>
	        </div>
	 	</div>
</template>




<script type="text/ecmascript-6">
//不管是一次性加载所有的数据还是分块加载，都需要对数据进行处理。

//如果一次性加载所有的数据，需要用户定义二级名称
import data from "./data.js";
export default {
	props: {
		initShowList: {
			type: Array,
			default: () => []
		},
		clue: {
			type: String,
			default: "id"
		},
		pid: {
			type: String,
			default: "parent_id"
		},
		initlist: {
			type: Array,
			default: () => []
		},
		name: {
			type: String,
			default: "area_name"
		},
		mode: {
			type: String,
			default: "0"
		},
		child: {
			type: String,
			default: "child"
		},
		label: {
			type: String,
			default: "地址"
		},
		vbeauty: {
			type: Boolean,
			default: false
		},
		prop: String
	},
	data() {
		return {
			showPanel: false,
			list: {},
			showList: [],
			currentIndex: 0, // 1,2,3
			current: [
				{
					name: "请选择"
				}
			],
			finish: []
		};
	},
	computed: {
		addressValue() {
			return this.finish
				.map(item => (item[this.name] ? item[this.name] : ""))
				.join(" ");
		}
	},
	created() {
		//触发用户定义的promise事件；
		//this.showList = await this.getProvince();
		// 初始化回显

		if (Array.isArray(this.initShowList) && this.initShowList.length > 0) {
			this.current = [].concat(this.initShowList);
			this.finish = [].concat(
				this.current.map(item => {
					return {
						[this.clue]: item[this.clue],
						[this.name]: item[this.name]
					};
				})
			);
		}
		if (this.mode === "0") {
			this.list = data;
			this.showList = this.list;
			this.handlerRecover();
			return;
		} else if (this.mode === "2") {
			this.$emit("onload", {
				level: 2,
				level_code: this.current[1][this.clue]
			});
			this.currentIndex = 2;
		} else if (this.mode === "1") {
			this.showCurrent(this.current[0], 0);
		}
	},
	watch: {
		finish(val) {
			this.addressValue;
			this.$emit("input", val);
		},
		initlist: function() {
			this.showList = this.initlist;
			//once load data
			if (this.mode === "1") {
				this.list = this.orgData(this.initlist, 0);
				//存在原始值，读区值
				this.handlerRecover();
				return;
			}
			let { currentIndex } = this;
			switch (currentIndex) {
				case 0:
					this.list = this.convert(this.initlist);
					this.showList = this.list;
					break;
				case 1:
					let opts = this.current[0];
					let city = this.initlist;
					this.showList = city;
					if (JSON.stringify(this.list) !== "{}") {
						this.list[String(opts[this.clue]).trim()][
							this.child
						] = this.convert(city);
					}
					break;
				case 2:
					let _city = Object.assign({}, this.current[1]);
					let county = this.initlist;
					const province = this.current[0][this.clue];
					this.showList = county;
					if (JSON.stringify(this.list) !== "{}") {
						this.list[province][this.child][_city[this.clue]][
							this.child
						] = this.convert(county);
					}
			}
		}
	},
	methods: {
		handlerRecover() {
			const ctl = this.current.length;
			switch (ctl) {
				case 2:
					this.getCity(this.current[0]);
					this.currentIndex = 1;
					break;
				case 3:
					this.getCounty(this.current[1]);
					this.currentIndex = 2;
					break;
			}
			return;
		},
		closeDropdown() {
			this.showPanel = false;
		},
		toggleDropdown() {
			this.showPanel = !this.showPanel;
		},
		//重组数据，
		orgData(data, parent_id) {
			var tree = {};
			var temp;
			for (var i = 0; i < data.length; i++) {
				if (data[i][this.pid] === parent_id) {
					var obj = data[i];
					temp = this.orgData(data, data[i][this.clue]);
					if (JSON.stringify(temp) != "{}") {
						obj[this.child] = temp;
					}
					tree[data[i][this.clue]] = obj;
				}
			}
			return tree;
		},
		showCurrent(item, index) {
			this.currentIndex = index;
			switch (index) {
				case 0: {
					this.getProvince();
					break;
				}
				case 1: {
					this.getCity(this.current[0]);
					break;
				}
				case 2: {
					this.getCounty(this.current[1]);
					break;
				}
				default: {
					console.error("传入参数错误");
				}
			}
		},

		getNext(opts) {
			const index = this.currentIndex;
			switch (index) {
				case 0: {
					this.getCity(opts);
					const current = [].concat(this.current);
					current[0] = Object.assign(opts);
					current[1] = Object.assign({
						name: "请选择"
					});

					if (opts[this.clue] !== this.current[0][this.clue]) {
						this.current = current.slice(0, 2);
					} else {
						this.current = current;
					}
					this.currentIndex = 1;
					break;
				}
				case 1: {
					this.getCounty(opts);
					this.current[1] = Object.assign({}, opts);
					this.current[2] = Object.assign({
						name: "请选择"
					});
					this.current = [].concat(this.current);
					this.currentIndex = 2;
					break;
				}
				case 2: {
					this.current[2] = Object.assign({}, opts);
					this.current = [].concat(this.current);
					this.finish = [].concat(
						this.current.map(item => {
							return {
								[this.clue]: item[this.clue],
								[this.name]: item[this.name]
							};
						})
					);
					this.showPanel = false;
					//用户捕获事件
					this.$emit("onchange", this.finish);
					break;
				}
				default: {
					console.error("传入参数错误");
				}
			}
		},

		convert(list) {
			const data = {};
			if (Array.isArray(list)) {
				list.forEach(item => {
					data[String(item[this.clue]).trim()] = item;
				});
			}
			return data;
		},
		reconvert(obj) {
			const data = [];
			for (const i in obj) {
				data.push(obj[i]);
			}
			return data;
		},
		getAllData() {
			this.getAddress(opts);
		},
		getProvince() {
			if (this.list && JSON.stringify(this.list) != "{}") {
				this.showList = this.list;
				return;
			}
			let opts = { level: 1 };
			this.getAddress(opts);
		},
		getCity(opts) {
			if (
				this.list &&
				JSON.stringify(this.list) !== "{}" &&
				this.list[String(opts[this.clue]).trim()][this.child]
			) {
				const data = this.list[String(opts[this.clue]).trim()][
					this.child
				];
				this.showList = data;
				return;
			}
			let _opts = { level: 2, level_code: opts[this.clue] };
			this.getAddress(_opts);
		},

		getCounty(opts) {
			const city = Object.assign({}, opts);
			const province = this.current[0][this.clue];
			if (
				this.list &&
				JSON.stringify(this.list) !== "{}" &&
				this.list[province][this.child] &&
				this.list[province][this.child][city[this.clue]] &&
				this.list[province][this.child][city[this.clue]][this.child]
			) {
				const data = this.list[province][this.child][city[this.clue]][
					this.child
				];
				this.showList = data;
				return this.reconvert(data);
			}

			let _opts = { level: 3, level_code: city[this.clue] };
			this.getAddress(_opts);
		},
		getAddress(opts) {
			this.showList = [];
			this.$emit("onload", opts);
			return;
		},
		clear() {
			this.finish = [];
			this.current = [{ name: "请选择" }];
			this.showList = this.list;
			this.currentIndex = 0;
		}
	}
};
</script>
