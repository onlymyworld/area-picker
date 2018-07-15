<template>
  <div class="hello">
  	<area-picker @onchange="getChoosed"/>
  </div>
</template>

<script>
import areaPicker from "./area-picker/index";
export default {
	data() {
		return {};
	},
	methods: {
		getChoosed(val) {
			console.log(val);
		}
	},
	components: { "area-picker": areaPicker }
};
</script>
