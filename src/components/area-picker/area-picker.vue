<template>
	 	<div class="ant-address">
	 		<v-form-item label="地址" required  :prop="prop" v-if="vbeauty" >
		 		<div class="ant-address__text" @click="toggleDropdown" >
		 			<v-input type="text" placeholder="请选择" size="middle" readonly v-bind="$attrs" v-model="finish">
		 			</v-input>
					<span class="ant-address__clear" v-show="finish.length >= 2" @click.stop="clear"></span>
		 		</div>
	 		</v-form-item>
	 		<div class="ant-address__label" v-else>
	 			<div class="ant-address__label_inner">{{label}}：</div>
		 		<div class="ant-address__text ant-address__border ant-address__pad" @click="toggleDropdown" >
		 			<span>{{finish}}</span>
		 			<span class="ant-address__clear" v-show="finish.length >= 2" @click.stop="clear"></span>
		 		</div>
	 		</div>
	 		<div class="ant-address__masklayer" v-show="showPanel" @click="toggleDropdown"></div>
	 		<div class="ant-address__select" v-if="showPanel">
	            <ul class="ant-address__select-header">
	                <li v-for="(item, index) in current" @click="showCurrent(item, index)" :class=" index == currentIndex ? 'actived' : '' ">{{item[name] ? item[name]: item.name}}</li>
	            </ul>
	            <ul class="ant-address__select-content">
	            	<li class="loading" v-if="showList.length == 0 ">加载中。。。</li>
	                <li v-for="item in showList" @click="getNext(item)" :class="current[currentIndex][clue] == item[clue] ? 'actived' : '' ">{{item[name] ? item[name] : item}}</li>
	            </ul>
	        </div>
	 	</div>
</template>

<script type="text/ecmascript-6">
import data from './data';

export default {
    props: {
        // 默认值，
        value: {
            type: String,
            default: '',
        },
        // 分割方式
        split: {
            type: String,
            default: ';',
        },
        // 显示的层级，【省市】/ 【省市县】;
        level: {
            type: Number,
            default: 3,
        },
        // 默认显示列表
        initShowList: {
            type: Array,
            default: () => [],
        },
        // 数据加载函数，返回值必须是Promise;
        // 默认情况下必须传递data参数；如果使用本地数据渲染表格，业务代码中将获取本地数据包装为Promise即可。
        data: {
            type: Function,
            default: () => {},
        },
        // 使用模式
        mode: {
            type: Number,
            default: 0, // 0:使用默认数据，1:一次性加载所有数据，2:使用分块加载
        },
        // 标示ID
        clue: {
            type: String,
            default: 'id',
        },
        // 显示名称
        name: {
            type: String,
            default: 'area_name',
        },
        // 定义自对象名称
        child: {
            type: String,
            default: 'child',
        },
        // 标签名称
        label: {
            type: String,
            default: '地址',
        },
        // 是否支持vbeauty
        vbeauty: {
            type: Boolean,
            default: false,
        },
        // 当存在表单验证时，绑定的父form的验证名称
        prop: String,
        // 当一次性加载数据时，是否需要重组数据，
        orgdata: {
            type: Boolean,
            default: true, 
        },
        // 使用重组数据方法时，制定关联字段key
        pid: { 
            type: String,
            default: 'parent_id',
        },
    },
    data() {
        return {
            showPanel: false,
            isloading: false, // 正在加载数据
            list: {},
            originList: [], // 原始数据
            showList: [],
            currentIndex: 0, // 1,2,3
            current: [
                {
                    name: '请选择',
                },
            ],
            finish: '',
        };
    },
    created() {
        this.originList = [];
        if (this.value) {
            this.getInitList(data, 0);
        } else {
            this.originList = this.initShowList.slice(0, this.level);
        }
        if (this.mode === 0) this.list = data;
        if (Array.isArray(this.originList) && this.originList.length > 0) {
            this.current = [].concat(this.originList);
            this.finish = this.current
                .map(item => (item[this.name] ? item[this.name] : ''))
                .join(this.split);
        }
        const ln = this.current.length;
        if (this.mode === 0) {
            this.showCurrent({}, ln - 1);
            return;
        } 
        this.showCurrent({}, ln - 1);
    },
    watch: {
        finish() {
            this.$emit('input', this.getValues());
        },
        showPanel(val) {
            if (val) {
                this.$emit('show');
            } else {
                this.$emit('hide');
            }
        },
    },
    methods: {
        getInitList(orgData, index = 0) {
            const address = this.value.split(this.split);
            for (const i in orgData) {
                if (orgData[i][this.name] === address[index]) {
                    this.originList.push({ id: i, [this.name]: address[index] });
                    const child = orgData[i].child;
                    index++;
                    if (child && address[index] && this.level > index) {
                        this.getInitList(child, index);
                    }
                }
            }
        },
        closeDropdown() {
            this.showPanel = false;
        },
        toggleDropdown() {
            this.showPanel = !this.showPanel;
            // 有默认值，清除默认值后展示面板，加载一级目录数据
            if (
                this.showPanel
                && JSON.stringify(this.list) === '{}'
                && this.currentIndex === 0
            ) {
                this.showCurrent({}, 0);
            }
        },
        // 一次性加载数据时，重组数据，
        orgData(orgData = [], parentId) {
            const tree = {};
            let temp;
            for (let i = 0; i < orgData.length; i++) {
                if (orgData[i][this.pid] === parentId) {
                    const obj = orgData[i];
                    temp = this.orgData(orgData, orgData[i][this.clue]);
                    if (JSON.stringify(temp) !== '{}') {
                        obj[this.child] = temp;
                    }
                    tree[orgData[i][this.clue]] = obj;
                }
            }
            return tree;
        },
        getValues() {
            let area = [].concat(
                this.current.map(item => item[this.clue] && {
                    [this.clue]: item[this.clue],
                    [this.name]: item[this.name],
                }),
            );
            area = this.finish === '' ? [] : area;
            return area;
        },
        async loadData(opts) {
            this.showList = [];
            this.isloading = true;
            const promiseResult = await this.data(opts);
            this.isloading = false;
            // 一次性加载所有数据，并且使用默认的重组数据方法
            if (this.mode === 1 && this.orgdata) {
                return this.orgData(promiseResult, 0);
            }
            return promiseResult;
        },
        async showCurrent(item, index) {
            if (this.isloading) return;
            this.currentIndex = index;
            switch (index) {
                case 0: {
                    this.showList = await this.getProvince();
                    break;
                }
                case 1: {
                    this.showList = await this.getCity(this.current[0]);
                    break;
                }
                case 2: {
                    this.showList = await this.getCounty(this.current[1]);
                    break;
                }
                default: {
                    console.error('传入参数错误');
                }
            }
        },
        async getNext(opts) {
            const index = this.currentIndex;
            const defaultInfo = { name: '请选择' };
            switch (index) {
                case 0: {
                    const current = [].concat(this.current);
                    current[0] = Object.assign(opts);
                    // currentcurrent.slice(0, 2);
                    // if (opts.code !== this.current[0].code) {
                    //     this.current = current.slice(0, 2);
                    // } else {
                    //     this.current = current;
                    // }
                    if (this.level === 1) {
                        this.current = current.slice(0, 2);
                        this.getValue();
                        return false;
                    }
                    current[1] = Object.assign(defaultInfo);
                    this.current = current.slice(0, 2);
                    const city = await this.getCity(opts);
                    this.showList = city;
                    this.currentIndex = 1;
                    break;
                }
                case 1: {
                    this.current[1] = Object.assign({}, opts);
                    if (this.level === 2) {
                        this.getValue();
                        return false;
                    }
                    this.current[2] = Object.assign(defaultInfo);
                    const county = await this.getCounty(opts);
                    this.current = [].concat(this.current);
                    this.showList = county;
                    this.currentIndex = 2;
                    break;
                }
                case 2: {
                    this.current[2] = Object.assign({}, opts);
                    this.current = [].concat(this.current);
                    this.getValue();
                    break;
                }
                default: {
                    console.error('传入参数错误');
                }
            }
        },
        getValue() {
            this.showPanel = false;
            this.finishArr = [];
            this.finish = this.current
                .map(item => (item[this.name] ? item[this.name] : ''))
                .join(this.split);
            this.current.map((item) => {
                this.finishArr.push({
                    [this.clue]: item[this.clue],
                    [this.name]: item[this.name],
                });
            });
            this.$emit('change', this.finishArr);
        },
        convert(list) {
            const convertData = {};
            if (Array.isArray(list)) {
                list.forEach((item) => {
                    convertData[String(item[this.clue]).trim()] = item;
                });
            }
            return convertData;
        },
        reconvert(obj) {
            const reconvertData = [];
            for (const i in obj) {
                reconvertData.push(obj[i]);
            }
            return reconvertData;
        },
        async getProvince() {
            if (this.list && JSON.stringify(this.list) !== '{}') {
                return this.list;
            }
            const province = await this.loadData({ level: 1 });
            this.list = this.convert(province);
            return this.list;
        },

        async getCity(opts) {
            if (this.list && JSON.stringify(this.list) !== '{}' 
                && this.list[String(opts[this.clue]).trim()][this.child]) {
                const cityData = this.list[String(opts[this.clue]).trim()][this.child];
                return this.reconvert(cityData);
            }
            const city = await this.loadData({
                level: 2,
                level_code: opts[this.clue],
            });
            // 兼容回显
            if (JSON.stringify(this.list) !== '{}') {
                this.list[String(opts[this.clue]).trim()][this.child] = this.convert(city);
            } else if (this.mode === 1) {
                this.list = city;
                return this.list[String(opts[this.clue]).trim()][this.child];
            }
            return city;
        },
        async getCounty(opts) {
            const city = Object.assign({}, opts);
            const province = this.current[0][this.clue];
            if (
                this.list
                && JSON.stringify(this.list) !== '{}' 
                && this.list[province][this.child]
                && this.list[province][this.child][city[this.clue]]
                && this.list[province][this.child][city[this.clue]][this.child]
            ) {
                const countyData = this.list[province][this.child][city[this.clue]][this.child];
                return this.reconvert(countyData);
            }
            const county = await this.loadData({
                level: 3,
                level_code: city[this.clue],
            });
            if (JSON.stringify(this.list) !== '{}' && JSON.stringify(this.list[province][this.child])) {
                this.list[province][this.child][city[this.clue]][this.child] = this.convert(county);
            } else if (this.mode === 1) {
                this.list = county;
                return this.list[province][this.child][city[this.clue]][this.child];
            }
            return county;
        },
        clear() {
            this.finish = '';
            this.current = [{ name: '请选择' }];
            this.showList = this.list;
            this.currentIndex = 0;
            this.$emit('change', this.getValues());
        },

    },
};
</script>

