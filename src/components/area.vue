<template>
    <div>
        <area-picker
            value="陕西省 西安市 新城区"
            split=" "
            :level=3
	    	@change ="getChoosed"
            @hide="areaHide"
			@show="areaShow"
    	></area-picker>
    </div>
</template>

<script>
import areaPicker from './area-picker/index';
// value="四川省,成都市,武侯区"
// split=","
export default {
    data() {
        return {};
    },
    methods: {
        getChoosed(val) {
            console.log(val);
        },
        areaHide() {
            console.log('隐藏');
        },
        areaShow() {
            console.log('显示');
        },
    },
    components: { 'area-picker': areaPicker },
};
</script>
