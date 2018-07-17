<template>
  		<area-picker
	    	@onchange ="getChoosed"
    	></area-picker>
</template>

<script>
import areaPicker from './area-picker/index';

export default {
    data() {
        return {};
    },
    methods: {
        getChoosed(val) {
            console.log(val);
        },
    },
    components: { 'area-picker': areaPicker },
};
</script>
