siPT.renderTrunks = function($trunks)
{
    if($trunks.length <= 0)
    {
        this.$subTrunkBox.hide();
        return;
    }
    this.$subTrunkBox.show();

    var self = this;
    $trunks.each(function(i,trunk)
    {
        var $trunk = $(trunk);

        if(self.isRoot)
        {
            var inspector = new SeriesInspector($trunk,self.expandId + "_" + self.index,i,false);
            if(inspector.$view != null)
            {
                self.$subTrunkBox.append(inspector.$view);
                self.subInspectors.push(inspector);
            }
        }else{
            var $subLeaves = self.getSubLeaves($trunk);
            self.renderLeaves($subLeaves);
        }
    });
}
