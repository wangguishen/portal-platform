<template>
	<div class="navigation">
		<template v-for="menuItem in menuItems">
			<template v-if="menuItem.children">
				<div class="first_style" :class="{'m-second-class':menuItem.secondClass}" @click.stop="choicePresent(menuItem)">
					<span class="first_content" :title="menuItem.comp_name">{{menuItem.comp_name}}</span>
					<i class="el-icon-arrow-down icon icon_down"></i>
					<div class="double_style box_style">
						<div class="g-style-div">
							<template v-for="menu in menuItem.children">
								<template v-if="menu.children">
									<div class="double_name" :class="{'m-second-class':menu.secondClass}" @click.stop="choicePresent(menu)">
										<div class="show_box">
											<span :title="menu.comp_name">{{menu.comp_name}}</span>
											<i class="el-icon-arrow-down icon icon_down"></i>
										</div>
										<div class="triple_style box_style">
											<div class="g-style-div">
												<template v-for="triple in menu.children">
													<template v-if="triple.children">
														<div class="triple_name" :class="{'m-second-class':triple.secondClass}" @click.stop="choicePresent(triple)">
															<div class="show_box">
																<span :title="triple.comp_name">{{triple.comp_name}}</span>
																<i class="el-icon-arrow-down icon icon_down"></i>
															</div>
															<div class="quadra_style box_style">
																<div class="g-style-div">
																	<template v-for="quadra in triple.children">
																		<template v-if="quadra.children">
																			<div class="quadra_name" :class="{'m-second-class':quadra.secondClass}" @click.stop="choicePresent(quadra)">
																				<div class="show_box">
																					<span :title="quadra.comp_name">{{quadra.comp_name}}</span>
																					<i class="el-icon-arrow-down icon icon_down"></i>
																				</div>
																				<div class="penta_style box_style">
																					<div class="g-style-div">
																						<template v-for="penta in quadra.children">
																							<template v-if="penta.children">
																								<div class="penta_name" :class="{'m-second-class':penta.secondClass}" @click.stop="choicePresent(penta)">
																									<div class="show_box">
																										<span :title="penta.comp_name">{{penta.comp_name}}</span>
																										<i class="el-icon-arrow-down icon icon_down"></i>
																									</div>
																								</div>
																							</template>
																							<template v-else>
																								<div class="penta_name left_name" :class="{'m-second-class':penta.secondClass}" @click.stop="choicePresent(penta)" :title="penta.comp_name">
																									{{penta.comp_name}}
																								</div>
																							</template>
																						</template>
																					</div>
																				</div>
																			</div>
																		</template>
																		<template v-else>
																			<div class="quadra_name left_name" :class="{'m-second-class':quadra.secondClass}" @click.stop="choicePresent(quadra)" :title="quadra.comp_name">
																				{{quadra.comp_name}}
																			</div>
																		</template>
																	</template>
																</div>
															</div>
														</div>							
													</template>
													<template v-else>
														<div class="triple_name left_name" :class="{'m-second-class':triple.secondClass}" @click.stop="choicePresent(triple)" :title="triple.comp_name">
															{{triple.comp_name}}
														</div>
													</template>
												</template>
											</div>
										</div>
									</div>
								</template>
								<template v-else>
									<div class="double_name left_name" :class="{'m-second-class':menu.secondClass}" @click.stop="choicePresent(menu)" :title="menu.comp_name">
										{{menu.comp_name}}
									</div>
								</template>
							</template>
						</div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="first_style" :title="menuItem.comp_name" :class="{'m-second-class':menuItem.secondClass}" @click.stop="choicePresent(menuItem)">
					{{menuItem.comp_name}}
				</div>
			</template>
		</template>
	</div>
</template>
<script>
export default {
	data(){
		return{

		}
	},
	props:{
        menuItems: Array,
    },
	mounted() {
		let self = this;
		console.log("所有信息",self.menuItems)
	},
	methods: {
		choicePresent(item){
			let self = this;
			self.$emit('choicePresent',item)
		},
	}
}
</script>
<style scoped>
	.icon{
		font-size: 10px;
	}
	.icon_up{
		display:none;
	}
	.navigation{
		width:100%;
		/*height: 42px;*/
		line-height: 42px;
		margin-bottom: 20px;
		font-size:14px;
		border-radius: 5px;
		box-sizing: border-box;
	}
	.first_style{
		position: relative;
		display: inline-block;
		min-width: 120px;
		height: 42px;
		line-height: 42px;
		padding: 0 20px;
		/*color: #4d4d4d;*/
		cursor: pointer;
		text-align: center;
		box-sizing: border-box;
		/*border-bottom: 4px solid transparent;/*#20a0ff*/
	}
	.first_content{
		margin-right: 5px;
	}
	/*.first_style:hover{
		border-bottom-color: #20a0ff;
	}*/
	.icon_down,.icon_triple_down,.icon_quadra_name{
		display: inline-block;
		transition: transform 0.5s;
		-ms-transition: -ms-transform 0.5s;
		-moz-transition: -moz-transform 0.5s;
		-webkit-transition: -webkit-transform 0.5s;
		-o-transition: -o-transform 0.5s;
	}
	.first_style:hover>.icon_down{
		transform-origin:50% 38%;
		transform: rotate(-180deg);
		-ms-transform: rotate(-180deg);
		-webkit-transform: rotate(-180deg);
		-o-transform: rotate(-180deg);
		-moz-transform: rotate(-180deg);
	}
	.double_name:hover .icon_down,.triple_name:hover .icon_triple_down,.quadra_name:hover .icon_quadra_name,.penta_name:hover .icon_quadra_name{
		transform-origin:31% 41%;
		transform: rotate(-90deg);
		-ms-transform: rotate(-90deg);
		-webkit-transform: rotate(-90deg);
		-o-transform: rotate(-90deg);
		-moz-transform: rotate(-90deg);
	}
	.first_style:hover .double_style{
		display: block;
	}
	.box_style{
		display: none;
		position: absolute;
		z-index:100;
		min-width:100%;
		/*width:200px;*/
		background-color: transparent;
	}
	.double_style{
		top:40px;
		left:0;
		padding-top: 3px;
		width:100%;
	}
	.double_name{
		position: relative;
		height: 40px;
		line-height: 40px;
	}
	.double_name,.triple_name,.quadra_name,.penta_name{
		/*color:#fff;*/
		color:#000;
	}
	.double_name:hover,.triple_name:hover,.quadra_name:hover,.penta_name:hover{
		/*background-color: #324157;*/
		/*color:#20a0ff;*/
		background-color: #20a0ff;
		color:#fff;
	}
	.triple_style,.quadra_style,.penta_style{
		left:100%;
		top:0;
	}
	.double_name:hover .triple_style{
		display: block;
	}
	.triple_name:hover .quadra_style{
		display: block;
	}
	.quadra_name:hover .penta_style{
		display: block;
	}
	.left_name{
	    text-align: left;
    	padding-left: 15px;
    	overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	}
	.show_box{
		height:40px;
	}
	.show_box span{
		float:left;
		padding-left:15px;
	    display: inline-block;
	    width: 56%;
	    text-align: left;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	}
	.show_box .icon{
		float:right;
		height: 40px;
		line-height: 40px;
		padding-right:15px;
	}
	.g-style-div{
		margin-left:3px;
		/*background-color:#324157;*/
		background-color:#fff;
	}
</style>