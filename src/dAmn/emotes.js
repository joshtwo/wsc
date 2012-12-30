
wsc.dAmn.Emotes = function( client, storage, settings ) {

    settings.emotes.page = null;
    settings.emotes.fint = null;
    
    settings.emotes.configure_page = function( event, ui ) {
    
        var page = event.settings.page('Emotes');
        settings.emotes.page = page;
        settings.emotes.fetching = false;
        settings.emotes.loaded = false;
        
        var orig = {};
        orig.on = settings.emotes.on;
        var stat = '';
        if( orig.on ) {
            if( !settings.emotes.loaded || settings.emotes.fetching )
                stat = '<em>Fetching emotes...</em>';
            else
                stat = '<em>Emotes loaded.</em>';
        }
        
        page.item('Form', {
            'ref': 'switch',
            'title': 'Enable Emotes',
            'text': 'Here you can turn custom emotes on and off.\n\n<span class="emotestatus">'+stat+'</span>',
            'fields': [
                ['Checkbox', {
                    'ref': 'enabled',
                    'items': [ { 'value': 'yes', 'title': 'On', 'selected': orig.on } ]
                }]
            ],
            'event': {
                'change': function( event ) {
                    settings.emotes.on = (event.data.enabled.indexOf('yes') != -1);
                    if( settings.emotes.on ) {
                        settings.emotes.fetch();
                        return;
                    }
                    if( settings.emotes.fint === null )
                        return;
                    clearTimeout(settings.emotes.fint);
                    settings.emotes.fint = null;
                },
                'save': function( event ) {
                    orig.on = settings.emotes.on;
                    settings.save();
                },
                'close': function( event ) {
                    settings.emotes.on = orig.on;
                    settings.load();
                    settings.emotes.page = null;
                }
            }
        });
    
    };
    
    client.ui.on('settings.open.ran', settings.emotes.configure_page);
    
    settings.emotes.fetch = function(  ) {
        settings.emotes.fetching = true;
        jQuery.getJSON('http://www.thezikes.org/publicemotes.php?format=jsonp&jsoncallback=?&' + (new Date()).getDay(), function(data){
            if( !settings.emotes.loaded ) {
                if( settings.emotes.on ) {
                    client.cchannel.server_message('Emotes loaded');
                }
            }
            settings.emotes.fetching = false;
            settings.emotes.loaded = true;
            settings.emotes.emote = data;
            if( settings.emotes.page !== null ) {
                settings.emotes.page.view.find('.emotestatus')
                    .html('<em>Emotes loaded.</em>');
            }
            settings.emotes.fint = setTimeout( settings.emotes.fetch, 3600000 );
        });
        
        if( settings.emotes.page !== null ) {
            settings.emotes.page.view.find('.emotestatus')
                .html('<em>Fetching emotes...</em>');
        }
    };
    
    settings.emotes.swap = function( e ) {
    
        if( !settings.emotes.on )
            return;
        
        var fec = -1;
        for( var code in settings.emotes.emote ) {
            if( !settings.emotes.emote.hasOwnProperty(code) )
                continue;
            fec = e.input.indexOf(code);
            if( fec == -1 )
                continue;
            e.input = replaceAll(
                e.input, code,
                ':thumb' + settings.emotes.emote[code]['devid'] + ':'
            );
        }
        
        e.input = replaceAll( e.input, ':B', ':bucktooth:' );
    
    };
    
    client.bind('send.msg.before', settings.emotes.swap);
    client.bind('send.action.before', settings.emotes.swap);
    client.bind('send.kick.before', settings.emotes.swap);
    client.bind('send.set.before', settings.emotes.swap);
    
    if( !settings.emotes.on )
        return;
    
    settings.emotes.fetch();

};
