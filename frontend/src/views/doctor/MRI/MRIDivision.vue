<template>
  <div id="infoContainer">
    <div class="sm_box">
      <h2>肿瘤MRI上传与患者选定</h2>
    </div>
    <div class="margin_box">

      <div class="searchContent">
        <el-row :gutter="10" style="margin-bottom: 5px">
          <el-col :span="6">
            <el-button class="auto_width" plain type="primary" @click="doValid">开始推理</el-button>
          </el-col>
          <el-col :span="18">
            <el-input class="auto_width" :span="6" v-model="this.modelOutputMessage" readonly/>
          </el-col>
        </el-row>
        <el-row>
            <el-upload :auto-upload="false" :drag=true :multiple=true :on-remove="handleRemove" :accept="'.nii.gz'"
                       :on-change="readySendFile" multiple class="auto_width" >
              <i v-text="'上传T1,T1CE,T2,FLAIR波段NII.GZ文件'"/>
            </el-upload>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <img :src="this.imagesData['t1']" alt=""/>
            <h5> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;T1波段动态切面 </h5>
          </el-col>
          <el-col :span="6">
            <img :src="this.imagesData['t1ce']" alt=""/>
            <h5> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;T1CE波段动态切面 </h5>
          </el-col>
          <el-col :span="6">
            <img :src="this.imagesData['t2']" alt=""/>
            <h5>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;T2波段动态切面 </h5>

          </el-col>
          <el-col :span="6">
            <img :src="this.imagesData['flair']" alt=""/>
            <h5>&nbsp;&nbsp;&nbsp;&nbsp; FLAIR波段动态切面 </h5>

          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <img :src="this.imagesData['pred']" alt=""/>
            <h5>&nbsp;&nbsp;&nbsp;&nbsp; 分割结果Mask动态切面 </h5>

          </el-col>
          <el-col :span="6">
            <img :src="this.imagesData['mixed_pred']" alt=""/>
            <h5>&nbsp;&nbsp;&nbsp;&nbsp; 混合分割结果动态切面 </h5>

          </el-col>
          <el-col :span="6">
            <img :src="this.imagesData['demo']" alt=""/>
            <h5>&nbsp;&nbsp;&nbsp;&nbsp; 项目开发:何超 </h5>

          </el-col>
          <el-col :span="6">
            <img :src="this.imagesData['demo']" alt=""/>
            <h5>&nbsp;&nbsp;&nbsp;&nbsp; SDUST:202001021107 </h5>

          </el-col>
        </el-row>

        <h3>判定参数调整</h3>
        <el-row :gutter="10">
          <el-col v-for="item in this.editKeyList" :span="8">
            <el-input :placeholder=item.toString() class="sm_blank"/>
          </el-col>
        </el-row>
        <h3>插入数据库</h3>
        <el-row :gutter="10">
          <el-col :span="15">
            <el-autocomplete
                ref="myAutocomplete"
                v-model="searchKey"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="true"
                clearable
                placeholder="MRI对应肿瘤ID"
                size="medium"
                @clear="clearInput"
                @select="search"
                @keyup.enter.native="search"
            />
          </el-col>
          <el-col :span="9">
            <el-button class="auto_width" plain type="primary" @click="upLoadToDB">上传至肿瘤数据库</el-button>
          </el-col>
        </el-row>
        <!--        <el-radio-group>-->
        <!--          <el-radio v-for="item in chooseKeyList" v-model="chooseValueList" :label="item"/>-->
        <!--        </el-radio-group>-->
        <!--        <el-carousel-item v-for="item in 4" :key="item">-->
        <!--          <h3>{{'扫描高度'+dividedAnsItem[item] }}</h3>-->
        <!--        </el-carousel-item>-->
      </div>
    </div>
  </div>
</template>

<script src="./MRIDivision.js" type="text/javascript"></script>

<style scoped>
h5 {
  font-family: "Microsoft YaHei UI Light", serif;
}
img {
  max-width: 100%;
  max-height: 100%;
}

.auto_width {
  width: 100%
}
</style>
