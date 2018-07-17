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
import data from './data.js';

export default {
    props: {
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
        mode: {
        	type: Number,
        	default: 0, // 0:使用默认数据，1:一次性加载所有数据，2:使用分块加载
        },
        clue: {
            type: String,
            default: 'id',
        },
        name: {
            type: String,
            default: 'area_name',
        },
        child: {
            type: String,
            default: 'child',
        },
        label: {
            type: String,
            default: '地址',
        },
        vbeauty: {
            type: Boolean,
            default: false,
        },
        prop: String,
        orgdata: { // 当一次性加载数据时，是否需要重组数据，
            type: Boolean,
            default: true, 
        },
        pid: { // 使用重组数据方法时，制定关联字段key
            type: String,
            default: 'parent_id',
        },
    },
    data() {
        return {
            showPanel: false,
            list: {},
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
    async created() {
      	if (this.mode === 0) this.list = data;
        if (Array.isArray(this.initShowList) && this.initShowList.length > 0) {
            this.current = [].concat(this.initShowList);
            this.finish = this.current
                .map(item => (item[this.name] ? item[this.name] : ''))
                .join(' ');
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
    },
    methods: {
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
        orgData(data = [], parent_id) {
            const tree = {};
            let temp;
            for (let i = 0; i < data.length; i++) {
                if (data[i][this.pid] === parent_id) {
                    const obj = data[i];
                    temp = this.orgData(data, data[i][this.clue]);
                    if (JSON.stringify(temp) != '{}') {
                        obj[this.child] = temp;
                    }
                    tree[data[i][this.clue]] = obj;
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
            area = this.finish == '' ? [] : area;
            return area;
        },
        async loadData(opts) {
        	this.showList = [];
        	const promiseResult = await this.data(opts);
        	// 一次性加载所有数据，并且使用默认的重组数据方法
        	if (this.mode === 1 && orgdata) {
        		return this.orgData(promiseResult);
        	}
        	return promiseResult;
        },
        async showCurrent(item, index) {
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
            switch (index) {
                case 0: {
                    const city = await this.getCity(opts);
                    const current = [].concat(this.current);
                    current[0] = Object.assign(opts);
                    current[1] = Object.assign({
                        name: '请选择',
                    });

                    if (opts.code !== this.current[0].code) {
                        this.current = current.slice(0, 2);
                    } else {
                        this.current = current;
                    }

                    this.showList = city;
                    this.currentIndex = 1;
                    break;
                }
                case 1: {
                    const county = await this.getCounty(opts);
                    this.current[1] = Object.assign({}, opts);
                    this.current[2] = Object.assign({
                        name: '请选择',
                    });
                    this.current = [].concat(this.current);
                    this.showList = county;
                    this.currentIndex = 2;
                    break;
                }
                case 2: {
                    this.current[2] = Object.assign({}, opts);
                    this.current = [].concat(this.current);
                    this.$emit('change', this.current);
                    this.finish = this.current
                        .map(item => (item[this.name] ? item[this.name] : ''))
                        .join(' ');
                    this.showPanel = false;
                    this.$emit('onchange', this.getValues());
                    break;
                }
                default: {
                    console.error('传入参数错误');
                }
            }
        },

        convert(list) {
            const data = {};
            if (Array.isArray(list)) {
                list.forEach((item) => {
                    data[String(item.code).trim()] = item;
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

        async getProvince() {
            if (this.list && JSON.stringify(this.list) !== '{}') {
                return this.list;
            }
            const province = await this.loadData({ level: 1 });
            this.list = this.convert(province);
            return this.list;
        },

        async getCity(opts) {
            if (this.list && JSON.stringify(this.list) !== '{}' && this.list[String(opts[this.clue]).trim()][this.child]) {
                const data = this.list[String(opts[this.clue]).trim()][this.child];
                return this.reconvert(data);
            }
            const city = await this.loadData({
                level: 2,
                level_code: opts[this.clue],
            });
            // 兼容回显
            if (JSON.stringify(this.list) !== '{}') {
            	this.list[String(opts[this.clue]).trim()][this.child] = this.convert(city);
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
                const data = this.list[province][this.child][city[this.clue]][this.child];
                return this.reconvert(data);
            }
            const county = await this.loadData({
                level: 3,
                level_code: city[this.clue],
            });
            if (JSON.stringify(this.list) !== '{}' && JSON.stringify(this.list[province][this.child])) {
            	 this.list[province][this.child][city[this.clue]][this.child] = this.convert(
                	county,
            	);
            }
            return county;
        },
        clear() {
            this.finish = '';
            this.current = [{ name: '请选择' }];
            this.showList = this.list;
            this.currentIndex = 0;
            this.$emit('onchange', this.getValues());
        },

    },
};
</script>

