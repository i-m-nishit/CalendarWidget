How to use Widget?

var calendar = Alloy.createWidget('Calendar', {
           config : {
               type : 'weekly',
               weeks : 1,
               dateClass : 'midBrown',
               backgroundClass : 'creamYellowBackground'
           }
       }).getView();
       var window = $.UI.create('Window');
       window.add(calendar);
