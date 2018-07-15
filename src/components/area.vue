<template>
  		<area-picker
	    	@onchange ="getChoosed" 
	    	v-model="areaValues"
    	></area-picker>
</template>

<script>
import areaPicker from "./area-picker/index";

export default {
	data() {
		return {
			areaValues: [
				{ id: "610000", area_name: "陕西省" },
				{ id: "610700", area_name: "汉中市" },
				{ id: "610724", area_name: "西乡县" }
			]
		};
	},
	methods: {
		getChoosed(val) {
			console.log(val);
		}
	},
	components: { "area-picker": areaPicker }
};
</script>
