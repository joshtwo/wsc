/**
 * Object for managing channel interfaces.
 * 
 * @class Channel
 * @constructor
 * @param ui {Object} Chatterbox.UI object.
 * @param ns {String} The name of the channel this object will represent.
 * @param hidden {Boolean} Should the channel's tab be visible?
 * @param monitor {Boolean} Is this channel the monitor?
 */
Chatterbox.Channel = function( ui, ns, hidden, monitor ) {

    var selector = ui.deform_ns(ns).slice(1).toLowerCase();
    this.manager = ui;
    this.hidden = hidden;
    this.monitor = monitor || false;
    this.built = false;
    this.selector = selector;
    this.raw = ui.format_ns(ns);
    this.namespace = ui.deform_ns(ns);
    this.visible = false;
    this.st = 0;
    // UI elements.
    this.el = {
        t: {                        // Tab
            o: null,                //      Object..
            l: null,                //      Link
            c: null,                //      Close button
        },                          //
        m: null,                    // Main
        l: {                        // Channel log
            p: null,                //      Panel
            w: null,                //      Wrap
        },                          //
        u: null,                    // User panel
        h: {                        // Header
            title: null,            //      Title
            topic: null,            //      Topic
        }
    };
    this.mulw = 0;
    // Dimensions...
    this.d = {
        u: [0, 0],                  // User panel [ width, height ]
        h: {                        // Header
            title: [0, 0],          //      Title [ width, height ]
            topic: [0, 0]           //      Topic [ width, height ]
        }
    };

};

/**
 * Draw channel on screen and store the different elements in attributes.
 * 
 * @method build
 */
Chatterbox.Channel.prototype.build = function( ) {
    
    if( this.built )
        return;
    
    var selector = this.selector;
    ns = this.namespace;
    
    // Tabs.
    this.el.t.o = this.manager.nav.add_tab( selector, ns );
    this.el.t.l = this.el.t.o.find('.tab');
    this.el.t.c = this.el.t.o.find('.close');
    // Draw
    this.manager.chatbook.view.append(Chatterbox.render('channel', {'selector': selector, 'ns': ns}));
    // Store
    this.el.m = this.window = this.manager.chatbook.view.find('#' + selector + '-window');
    this.el.h.title = this.el.m.find('header div.title');
    this.el.h.topic = this.el.m.find('header div.topic');
    this.el.l.p = this.el.m.find('#' + selector + "-log");
    this.el.l.w = this.el.l.p.find('ul.logwrap');
    this.el.u = this.el.m.find('#' + selector + "-users");
    // Max user list width;
    this.mulw = parseInt(this.el.u.css('max-width').slice(0,-2));
    var chan = this;
    
    // When someone clicks the tab link.
    this.el.t.l.click(function () {
        chan.manager.toggle_channel(selector);
        return false;
    });
    
    // When someone clicks the tab close button.
    this.el.t.c.click(function ( e ) {
        chan.manager.trigger( 'tab.close.clicked', {
            'ns': chan.namespace,
            'chan': chan,
            'e': e
        } );
        return false;
    });
    
    var focus = true;
    
    this.el.m.click(
        function( e ) {
            if( focus )
                chan.manager.control.focus();
            else
                focus = true;
        }
    );
    
    this.el.l.p.select(
        function( ) {
            focus = false;
        }
    );
    
    if( this.hidden ) {
        this.el.t.o.toggleClass('hidden');
    }
    
    this.built = true;
};

/**
 * Hide the channel from view.
 * 
 * @method hide
 */
Chatterbox.Channel.prototype.hide = function( ) {
    //console.log("hide " + this.info.selector);
    this.el.m.css({'display': 'none'});
    this.el.t.o.removeClass('active');
    this.visible = false;
};

/**
 * Display the channel.
 * 
 * @method show
 */
Chatterbox.Channel.prototype.show = function( ) {
    this.visible = true;
    this.el.m.css({'display': 'block'});
    this.el.t.o.addClass('active');
    this.el.t.o.removeClass('noise chatting tabbed fill');
    var c = this;
    setTimeout( function(  ) {
        c.el.l.w.scrollTop(c.el.l.w.prop('scrollHeight') - c.el.l.w.innerHeight());
        c.resize();
        c.pad();
        c.el.l.w.scrollTop(c.el.l.w.prop('scrollHeight') - c.el.l.w.innerHeight());
    }, 500);
};

/**
 * Remove the channel from the UI.
 * 
 * @method remove
 */
Chatterbox.Channel.prototype.remove = function(  ) {
    this.el.t.o.remove();
    this.el.m.remove();
};

/**
 * Scroll the log panel downwards.
 * 
 * @method scroll
 */
Chatterbox.Channel.prototype.scroll = function( ) {
    this.pad();
    var ws = this.el.l.w.prop('scrollWidth') - this.el.l.w.innerWidth();
    var hs = this.el.l.w.prop('scrollHeight') - this.el.l.w.innerHeight();
    if( ws > 0 )
        hs += ws;
    if( hs < 0 || (hs - this.el.l.w.scrollTop()) > 100 )
        return;
    this.el.l.w.scrollTop(hs);
};

/**
 * Add padding to the channel log's wrapping ul.
 * This is done to make sure messages always appear at the bottom first.
 * 
 * @method pad
 */
Chatterbox.Channel.prototype.pad = function ( ) {
    // Add padding.
    this.el.l.w.css({'padding-top': 0, 'height': 'auto'});
    var wh = this.el.l.w.innerHeight();
    var lh = this.el.l.p.innerHeight() - this.el.h.topic.height() - 3;
    var pad = lh - wh;
    
    if( pad > 0 )
        this.el.l.w.css({'padding-top': pad});
    else
        this.el.l.w.css({
            'padding-top': 0,
            'height': lh});
    this.el.l.w.scrollTop(this.st);
};

/**
 * Fix the dimensions of the log window.
 * 
 * @method resize
 */
Chatterbox.Channel.prototype.resize = function( ) {
    this.el.l.w.css({'padding-top': 0});
    // Height.
    var wh = this.manager.chatbook.height();
    this.el.m.height(wh);
    // Width.
    var cw = this.el.m.width();
    
    // Userlist width.
    this.el.u.width(1);
    this.d.u[0] = this.el.u[0].scrollWidth + this.manager.swidth + 5;
    if( this.d.u[0] > this.mulw ) {
        this.d.u[0] = this.mulw;
    }
    this.el.u.width(this.d.u[0]);
    
    // Change log width based on userlist width.
    cw = cw - this.d.u[0];
    
    // Account for channel title in height.
    wh = wh - this.d.h.title[1];
        
    // Log panel dimensions
    this.el.l.p.css({
        height: wh - 3,
        width: cw - 3});
    
    // Scroll again just to make sure.
    this.scroll();
    
    // User list dimensions
    this.d.u[1] = this.el.l.p.innerHeight();
    this.el.u.css({height: this.d.u[1]});
};

/**
 * Called every now and then.
 * Does stuff like clear channels of excess log messages.
 * Maybe this is something that the UI lib should handle.
 * 
 * @method loop
 */
Chatterbox.Channel.prototype.loop = function(  ) {

    msgs = this.el.l.p.find( '.logmsg' );
    
    if( msgs.length < 200 )
        return;
    
    msgs.slice(0, msgs.length - 200).remove();
    this.resize();

};

/**
 * Display a log message.
 * 
 * @method log
 * @param msg {String} Message to display.
 */
Chatterbox.Channel.prototype.log = function( msg ) {
    data = {
        'ns': this.namespace,
        'message': msg};
    this.manager.trigger( 'log.before', data );
    this.log_item({ 'html': Chatterbox.render('logmsg', {'message': data.message}) });
};

/**
 * Send a message to the log window.
 * 
 * @method log_item
 * @param item {Object} Message to send.
 */
Chatterbox.Channel.prototype.log_item = function( item ) {
    var date = new Date();
    ts = '';
    
    if( this.manager.settings.clock ) {
        ts = formatTime('{HH}:{mm}:{ss}', date);
    } else {
        ts = formatTime('{hh}:{mm}:{ss} {mr}', date);
    }
        
    data = {
        'ts': ts,
        'ms': date.getTime(),
        'message': item.html,
        'user': (item.user || 'system' ).toLowerCase()
    };
    
    this.manager.trigger( 'log_item.before', data );
    if( this.visible ) {
        this.st = this.el.l.w.scrollTop();
    }
    
    // Add content.
    this.el.l.w.append(Chatterbox.render('logitem', data));
    this.manager.trigger( 'log_item.after', {'item': this.el.l.w.find('li').last() } );
    if( this.visible ) {
        this.st+= this.el.l.w.find('li.logmsg').last().height();
        this.el.l.w.scrollTop( this.st );
    }
    
    // Scrollio
    this.scroll();
    this.noise();
};

/**
 * Rewrite time signatures for all messages. Woo.
 * 
 * @method retime
 */
Chatterbox.Channel.prototype.retime = function(  ) {

    var tsf = '';
    var wrap = this.el.l.w;

    if( this.manager.settings.clock ) {
        tsf = '{HH}:{mm}:{ss}';
    } else {
        tsf = '{hh}:{mm}:{ss} {mr}';
    }

    wrap.find('span.ts').each(function( index, span ) {
    
        el = wrap.find(span);
        time = new Date(parseInt(el.prop('id')));
        el.text(formatTime(tsf, time));
    
    });

};

/**
 * Send a server message to the log window.
 * 
 * @method server_message
 * @param msg {String} Server message.
 * @param [info] {String} Extra information for the message.
 */
Chatterbox.Channel.prototype.server_message = function( msg, info ) {
    data = {
        'ns': this.namespace,
        'message': msg,
        'info': info};
    this.manager.trigger( 'server_message.before', data );
    this.log_item({ 'html': Chatterbox.render('servermsg', {'message': data.message, 'info': data.info}) });
};

/**
 * Clear all log messages from the log window.
 * 
 * @method clear
 */
Chatterbox.Channel.prototype.clear = function(  ) {
    this.el.l.p.find('li.logmsg').remove();
    this.el.l.p.find('li.loginfo').remove();
    this.el.l.w.height(0);
    this.resize();
};

/**
 * Display an info box in the channel log.
 * 
 * @method log_info
 * @param content {String} Infobox contents.
 */
Chatterbox.Channel.prototype.log_info = function( ref, content ) {
    data = {
        'ns': this.namespace,
        'ref': ref,
        'content': content
    };
    this.manager.trigger( 'log_info.before', data );
    delete data['ns'];
    var b = this.el.l.w.append(Chatterbox.render( 'loginfobox', data ));
    this.scroll();
    
    var ui = this;
    var box = this.el.l.w.find('li.' + data.ref);
    box.find('a.close').click(
        function( e ) {
            ui.el.l.w.find(this).parent().remove();
            ui.resize();
            return false;
        }
    );
    
    return box;
};

/**
 * Display a user's whois info.
 * 
 * @method show_whois
 * @param data {Object} Object containing a user's information.
 */
Chatterbox.Channel.prototype.log_whois = function( data ) {
    
    var whois = {
        'avatar': '<a href="#"><img height="50" width="50" alt="avatar"/></a>',
        'username': '<b>' + data.symbol + data.username + '</b>',
        'info': [],
        'conns': [],
        'raw': data,
    };
    
    for( var i in data.connections ) {
        var rcon = data.connections[i];
        var mcon = [];
        
        if( rcon.online ) {
            stamp = (new Date - (rcon.online * 1000));
            mcon.push([ 'online', DateStamp(stamp / 1000) + formatTime(' [{HH}:{mm}:{ss}]', new Date(stamp)) ]);
        }
        if( rcon.idle )
            mcon.push([ 'idle', timeLengthString(rcon.idle) ]);
        if( rcon.agent )
            mcon.push([ 'agent', rcon.agent ]);
        if( rcon.debug )
            mcon.push([ 'debug', rcon.debug ]);
        
        mcon.push([ 'chatrooms', rcon.channels.join(' ') ]);
        
        whois.conns.push(mcon);
    }
    
    this.manager.trigger( 'log_whois.before', whois );
    
    var conns = '';
    for( var i in whois.conns ) {
        var conn = whois.conns[i];
        var text = '<section class="conn"><p><em>connection ' + ((parseInt(i) + 1).toString()) + ':</em></p>';
        text+= '<ul>';
        for( x in conn ) {
            text+= '<li><strong>' + conn[x][0] + ':</strong> ' + conn[x][1] + '</li>';
        }
        text+= '</ul>'
        conns+= text + '</section>';
    }
    
    var info = '';
    for( var i in whois.info ) {
        info+= '<li>' + whois.info[i] + '</li>';
    }
    
    var box = this.log_info(
        'whois-'+data.username,
        Chatterbox.render('whoiswrap', {
            'avatar': whois.avatar,
            'info': Chatterbox.render('whoisinfo', {
                'username': whois.username,
                'info': info,
                'connections': conns
            })
        })
    );
    
    var av = box.find('div.avatar');
    var inf = box.find('div.info');
    inf.width( box.find('.whoiswrap').width() - 100 );
    av.height( box.height() - 10 );
    this.scroll();
};

/**
 * Display some information relating to a privilege class.
 * 
 * @method log_pc
 * @param privileges {Boolean} Are we showing privileges or users?
 * @param data {Array} Array containing information.
 */
Chatterbox.Channel.prototype.log_pc = function( privileges, data ) {

    contents = '';
    for( var i in data ) {
        if( !data.hasOwnProperty(i) )
            continue;
        var pc = data[i];
        var pcc = '';
        if( pc[2].length == 0 ) {
            pcc = '<em>' + ( privileges ? 'default privileges' : 'no members' ) + '</em>';
        } else {
            pcc = pc[2];
        }
        contents+= String.format('<li><em>{0}</em> <strong>{1}</strong>:<ul><li>{2}</li></ul></li>', [pc[1], pc[0], pcc ]);
    }
    
    var info = {
        'title': 'Privilege class ' + (privileges ? 'permissions' : 'members'),
        'info': '<ul>' + contents + '</ul>'
    };
    
    this.log_info(
        'pc-' + ( privileges ? 'permissions' : 'members' ),
        Chatterbox.render( 'pcinfo', info )
    );

};

/**
 * Set the channel header.
 * This can be the title or topic, determined by `head`.
 * 
 * @method set_header
 * @param head {String} Should be 'title' or 'topic'.
 * @param content {String} HTML to use for the header.
 */
Chatterbox.Channel.prototype.set_header = function( head, content ) {
    head = head.toLowerCase();
    
    this.el.h[head].replaceWith(
        Chatterbox.render('header', {'head': head, 'content': content || ''})
    );
    
    this.el.h[head] = this.el.m.find('header div.' + head);
    
    if( content.length > 0 ) {
        this.el.h[head].css( { display: 'block' } );
        this.d.h[head] = [
            this.el.h[head].outerWidth(true),
            this.el.h[head].outerHeight(true)
        ];
    } else {
        this.el.h[head].css( { display: 'none' } );
        this.d.h[head] = [0, 0];
    }
        
    this.resize();
};

/**
 * Get a channel header's contents.
 * 
 * @method get_header
 * @param head {String} Should be 'title' or 'topic'.
 * @return {Object} Content of the header.
 */
Chatterbox.Channel.prototype.get_header = function( head ) {

    return this.el.h[head.toLowerCase()];

};

/**
 * Set the channel user list.
 * 
 * @method set_user_list
 * @param userlist {Array} Listing of users in the channel.
 */
Chatterbox.Channel.prototype.set_user_list = function( userlist ) {
    
    if( Object.size(userlist) == 0 )
        return;
    
    var infoboxes = [];
    var html = '';
    var pc = {};
    var conn = '';
    var user = '';
    
    for( var order in userlist ) {
        pc = userlist[order];
        html += '<div class="pc"><h3>' + pc.name + '</h3><ul>';
        for( var un in pc.users ) {
            user = pc.users[un];
            conn = user.conn == 1 ? '' : '[' + user.conn + ']';
            html+= '<li><a target="_blank" id="' + user.name + '" href="http://' + user.name + '.' + this.manager.settings['domain'] + '"><em>' + user.symbol + '</em>' + user.name + '</a>' + conn + '</li>'
            if( user.hover )
                infoboxes.push(user.hover);
        }
        html+= '</ul></div>';
    }
    
    this.el.m.find('div.chatusers').html(html);
    this.el.u = this.el.m.find('div.chatusers');
    this.el.u.css({display: 'block'});
    this.d.u = [
        this.el.u.outerWidth(),
        this.el.u.outerHeight()
    ];
    
    for( var index in infoboxes ) {
        this.userinfo(infoboxes[index]);
    }
    this.resize();
    
};

/**
 * The user has been highlighted in this channel.
 * Highlights the last log message in the channel's log and animates the
 * channel tab if the channel is not visible.
 * 
 * @method highlight
 * @param [message] {Object} jQuery object for an html element. If provided,
 *   this element will be highlighted instead of the channel's last log
 *   message.
 */
Chatterbox.Channel.prototype.highlight = function( message ) {
    
    var tab = this.el.t.o;
    ( message || this.el.l.w.find('.logmsg').last() ).addClass('highlight');
    
    if( tab.hasClass('active') )
        return;
    
    if( tab.hasClass('tabbed') )
        return;
    
    if( tab.hasClass('chatting') )
        tab.removeClass('chatting');
    
    var runs = 0;
    tab.addClass('tabbed');
    
    function toggles() {
        runs++;
        tab.toggleClass('fill');
        if( runs == 6 )
            return;
        setTimeout( toggles, 1000 );
    }
    
    toggles();
    
};

/**
 * There has been activity in this channel.
 * Modifies the channel tab slightly, if the channel is not currently being
 * viewed.
 * 
 * @method noise
 */
Chatterbox.Channel.prototype.noise = function(  ) {
    
    var u = '';
    var si = 0;
    var msg = this.el.m.find('.logmsg').last();
    
    for( var i in this.manager.umuted ) {
        if( !this.manager.umuted.hasOwnProperty(i) )
            continue;
        
        if( msg.hasClass('u-' + this.manager.umuted[i]) ) {
            msg.css({'display': 'none'});
            this.scroll();
            return;
        }
    }
    
    if( !this.el.t.o.hasClass('active') ) {
        this.el.t.o.addClass('noise');
        if( !this.el.t.o.hasClass('tabbed') ) {
            if( msg.find('.cevent').length == 0 ) {
                this.el.t.o.addClass('chatting');
            }
        }
    }
    

};

/**
 * Display a user info hover box.
 * 
 * @method userinfo
 * @param user {Object} Information about a user.
 * @return {Object} jQuery object representing the information box.
 */
Chatterbox.Channel.prototype.userinfo = function( user ) {

    var link = this.el.m.find( 'a#' + user.name );
    
    if( link.length == 0 )
        return;

    var chan = this;
    var box = null;
    
    link.hover(
        function( e ) {
            user.info = [];
            var ed = { 'ns': chan.namespace, 'user': user };
            chan.manager.trigger( 'userinfo.before', ed );
            user = ed.user;
            var infoli = '';
            
            for( index in user.info ) {
                infoli+= '<li>' + user.info[index] + '</li>';
            }
            
            chan.window.append(Chatterbox.render('userinfo', {
                'username': user.name,
                'avatar': user.avatar,
                'link': user.link,
                'info': infoli}));
            
            box = chan.window.find('.userinfo#'+user.name);
            chan.window.find('div.userinfo:not(\'#' + user.name + '\')').remove();
            var pos = link.offset();
            box.css({ 'top': (pos.top - link.height()) + 10, 'left': (pos.left - (box.width())) - 6 });
            box.find('.info').height(box.height());
            
            box.hover(
                function(){ box.data('hover', 1); },
                function( e ) {
                    box.data('hover', 0);
                    chan.unhover_user( box, e );
                }
            );
            
            box.data('hover', 0);
        },
        function( e ) {
            link.data('hover', 0);
            chan.unhover_user(box, e);
        }
    );

};

/**
 * This method tries to get rid of the given user information box.
 * The information box can only be removed if the cursor is outside the
 * bounds of the information box AND outside of the bounds of the user link in
 * the user list.
 * 
 * @method unhover_user
 * @param box {Object} A jQuery object representing the information box.
 * @param event {Object} jQuery event object.
 */
Chatterbox.Channel.prototype.unhover_user = function( box, event ) {

    var o = box.offset();
    var eb = box.outerHeight(true) + o.top;
    var er = box.outerWidth(true) + o.left;
    var x = event.pageX;
    var y = event.pageY;
    
    if( x > o.left
        && x < er
        && y > o.top
        && y < eb)
        return;
    
    if( x < (er + 15)
        && x > o.left
        && y > o.top
        && y < (o.top + 15) )
        return;
    
    box.remove();

};

/**
 * Hide messages from a given user.
 * 
 * @method mute_user
 * @param user {String} User to hide messages for.
 */
Chatterbox.Channel.prototype.mute_user = function( user ) {

    if( !user )
        return;
    this.el.l.w.find('li.logmsg.u-' + user.toLowerCase()).css({'display': 'none'});
    this.scroll();

};

/**
 * Reveal messages received from a given user.
 *
 * @method unmute_user
 * @param user {String} Use to reveal messages for.
 */
Chatterbox.Channel.prototype.unmute_user = function( user ) {

    if( !user )
        return;
    this.el.l.w.find('li.logmsg.u-' + user.toLowerCase()).css({'display': 'list-item'});
    this.scroll();

};

/**
 * Remove a user's messages completely.
 * 
 * @method clear_user
 * @param user {String} User to remove messages for.
 */
Chatterbox.Channel.prototype.clear_user = function( user ) {

    if( !user )
        return;
    this.el.l.w.find('li.logmsg.u-' + user.toLowerCase()).remove();
    this.scroll();

};


