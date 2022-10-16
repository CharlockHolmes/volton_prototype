class Builder {
  constructor() {
    if (CAPTCHA_Validate()) {
      console.log("ayyaya");
      createRenderer();
      createScene();
      loadSavedValues();
      letInit();
      loadTextField();
      this.tutorial;
      this.gapTable;
      this.layout;
      this.componentTable;
      setTimeout(() => {
        this.tutorial = new TutorialHandler();
        this.gapTable = new DomTable(r.gaps.length, r.radius, inchPerUnit);
        this.gapTable.uploadTableData();
        this.layout = new LayoutHandler();
        this.componentTable = new ComponentTableManager();
        document.getElementById("loadingbanner").innerHTML = "";
      }, 1000);
    }
  }
}

const build = new Builder();
document.getElementById("retro").onclick = () => {
  build.layout.specialMode();
};
