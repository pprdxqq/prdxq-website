/* PRDXQ / replace unicode arrow glyphs with the bespoke CSS-drawn arrow.
   Text remains accessible; the decorative drawing is hidden from assistive tech. */
(()=> {
  const directions={"↗":"ne","↘":"se","↖":"nw","↙":"sw","←":"west","→":"east","↑":"north","↓":"south"};
  const skip=new Set(["SCRIPT","STYLE","NOSCRIPT","TEXTAREA","INPUT","CODE","PRE"]);
  function enhanceText(node){
    const parent=node&&node.parentElement;
    if(!parent||skip.has(parent.tagName)||parent.closest("[aria-hidden='true'],.prdxq-arrow-glyph"))return;
    const value=node.nodeValue||"";
    if(!/[↗↘↖↙←→↑↓]/.test(value)||(value.match(/[↗↘↖↙←→↑↓]/g)||[]).length>1)return;
    const fragment=document.createDocumentFragment();
    let last=0;const re=/[↗↘↖↙←→↑↓]/g;let match;
    while((match=re.exec(value))){
      if(match.index>last)fragment.append(document.createTextNode(value.slice(last,match.index)));
      const arrow=document.createElement("span");
      arrow.className="prdxq-arrow-glyph";
      arrow.dataset.arrow=directions[match[0]];
      arrow.setAttribute("aria-hidden","true");
      fragment.append(arrow);last=match.index+match[0].length;
    }
    if(last<value.length)fragment.append(document.createTextNode(value.slice(last)));
    node.replaceWith(fragment);
  }
  function enhance(root){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(enhanceText);
  }
  function start(){
    enhance(document.body);
    const observer=new MutationObserver(records=>records.forEach(record=>{
      record.addedNodes.forEach(node=>{
        if(node.nodeType===Node.TEXT_NODE)enhanceText(node);
        else if(node.nodeType===Node.ELEMENT_NODE)enhance(node);
      });
    }));
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
