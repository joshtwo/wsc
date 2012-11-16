/**
 * Container object for HTML5 templates for the chat UI.
 * 
 * @class template
 */
Chatterbox.template = {};

/**
 * Helper method to render templates.
 * This method is actually a static method on the Chatterbox module.
 * 
 * @method render
 * @param template {String} Name of the template to render.
 * @param fill {Object} Variables to render the template with.
 */
Chatterbox.render = function( template, fill ) {

    var html = Chatterbox.template;
    var tparts = template.split('.');
    var renderer = {};
    var tmpl = null;
    
    for( ind in tparts ) {
        part = tparts[ind];
        if( !html.hasOwnProperty( part ) )
            return '';
        html = html[part];
    }
    
    if( html.hasOwnProperty('frame') ) {
        tmpl = html;
        renderer = html.render || {};
        html = html.frame;
        if( tmpl.hasOwnProperty('pre') ) {
            if( typeof tmpl.pre == 'function' ) {
                html = tmpl.pre( html, fill );
            } else {
                for( i in tmpl.pre ) {
                    html = tmpl.pre[i]( html, fill );
                }
            }
        }
    }
    
    for( key in fill ) {
        html = replaceAll(html, '{'+key+'}', ( renderer[key] || Chatterbox.template.render_stub )( fill[key] || '' ));
    }
    
    if( tmpl != null ) {
        if( tmpl.hasOwnProperty('post') ) {
            if( typeof tmpl.post == 'function' ) {
                html = tmpl.post( html, fill );
            } else {
                for( i in tmpl.post ) {
                    html = tmpl.post[i]( html, fill );
                }
            }
        }
    }
    
    return html;

};

Chatterbox.template.render_stub = function( data ) { return data; };
Chatterbox.template.clean = function( keys ) {

    return function( html, fill ) {
        for( i in keys ) {
            html = replaceAll( html, '{'+keys[i]+'}', '' );
        }
        return html;
    };

};


/**
 * This template provides the HTML for a chat client's main view.
 *
 * @property ui
 * @type String
 */
Chatterbox.template.ui = '<nav class="tabs"><ul id="chattabs" class="tabs"></ul>\
        <ul id="tabnav">\
            <li><a href="#left" class="button iconic arrow_left"></a></li>\
            <li><a href="#right" class="button iconic arrow_right"></a></li>\
            <li><a href="#settings" title="Change client settings" class="button iconic cog" id="settings-button"></a></li>\
        </ul>\
        </nav>\
        <div class="chatbook"></div>';

/**
 * HTML for an input panel.
 * 
 * @property control
 * @type String
 */
Chatterbox.template.control = '<div class="chatcontrol">\
            <p><a href="#multiline" title="Toggle multiline input" class="button iconic list"></a></p>\
            <form class="msg">\
                <input type="text" class="msg" />\
                <textarea class="msg"></textarea>\
                <input type="submit" value="Send" class="sendmsg" />\
            </form>\
        </div>';

/**
 * HTML for a channel tab.
 * 
 * @property tab
 * @type String
 */
Chatterbox.template.tab = '<li id="{selector}-tab"><a href="#{selector}" class="tab">{ns}<a href="#{selector}" class="close iconic x"></a></a></li>';

/**
 * HTML template for a channel view.
 * 
 * @property channel
 * @type String
 */
Chatterbox.template.channel = '<div class="chatwindow" id="{selector}-window">\
                    <header>\
                        <div class="title"></div>\
                    </header>\
                    <div class="chatlog" id="{selector}-log">\
                        <header>\
                            <div class="topic"></div>\
                        </header>\
                        <ul class="logwrap"></ul>\
                    </div>\
                    <div class="chatusers" id="{selector}-users">\
                </div>\
            </div>';

/**
 * Channel header HTML template.
 * 
 * @property header
 * @type String
 */
Chatterbox.template.header = '<div class="{head}">{content}</div>';

/**
 * Log message template.
 * 
 * @property logmsg
 * @type String
 */
Chatterbox.template.logmsg = '<span class="message">{message}</span>';

/**
 * Simple log template.
 * 
 * @property logitem
 * @type String
 */
Chatterbox.template.logitem = '<li class="logmsg"><span class="ts" id="{ms}">{ts}</span> {message}</li>';

/**
 * Server message template.
 * 
 * @property servermsg
 * @type String
 */
Chatterbox.template.servermsg = '<span class="servermsg">** {message} * <em>{info}</em></span>';

/**
 * User message template.
 * 
 * @property usermsg
 * @type String
 */
Chatterbox.template.usermsg = '<strong class="user">&lt;{user}&gt;</strong> {message}';

/**
 * User info box (userlist hover)
 * 
 * @property userinfo
 * @type String
 */
Chatterbox.template.userinfo = '<div class="userinfo" id="{username}">\
                            <div class="avatar">\
                                {avatar}\
                            </div><div class="info">\
                            <strong>\
                            {link}\
                            </strong>\
                            <ul>{info}</ul></div>\
                        </div>';

                        
Chatterbox.template.loginfobox = '<li class="loginfo {ref}"><a href="#{ref}" class="close iconic x"></a>{content}</li>';
Chatterbox.template.whois = {};
Chatterbox.template.whoiswrap = '<div class="whoiswrap">\
                                <div class="avatar">{avatar}</div>\
                                <div class="info">{info}</div>\
                                </div>';
Chatterbox.template.whoisinfo = '<p>{username}</p><ul>{info}</ul>{connections}';
Chatterbox.template.pcinfo = '<section class="pcinfo"><strong>{title}</strong>{info}</section>';

/**
 * Container for popup shit.
 * 
 * @property popup
 * @type String
 */
Chatterbox.template.popup = '<div class="floater {ref}"><div class="inner"><h2>{title}</h2><div class="content">{content}</div></div></div>';

/**
 * Settings stuff.
 *
 * @class settings
 */
Chatterbox.template.settings = {};
Chatterbox.template.settings.main = '<div class="bookwrap">\
                                <nav class="tabs">\
                                    <ul class="tabs"></ul>\
                                </nav>\
                                <div class="book"></div>\
                            </div>\
                            <footer>\
                                <a href="#save" class="button save">Save</a> <a href="#saveclose" class="button saveclose">Save & Close</a> <a href="#close" class="button close big square iconic x"></a>\
                            </footer>';

Chatterbox.template.settings.page = '<div class="page" id="{ref}-page"></div>';
Chatterbox.template.settings.tab = '<li id="{ref}-tab"><a href="#{ref}" class="tab" id="{ref}-tab">{name}</a></li>';

// Key renderers.
Chatterbox.template.settings.krender = {};
Chatterbox.template.settings.krender.title = function( title ) {
    if( title.length == 0 )
        return '';
    return '<h3>' + title + '</h3>';
};
Chatterbox.template.settings.krender.text = function( text ) { return replaceAll(text, '\n\n', '\n</p><p>\n'); };
Chatterbox.template.settings.krender.dditems = function( items ) {
    if( items.length == 0 )
        return '';
    render = '';
    
    for( i in items ) {
    
        item = items[i];
        render+= '<option value="' + item.value + '"';
        if( item.selected ) {
            render+= ' selected="yes"';
        }
        render+= '>' + item.title + '</option>';
    
    }
    return render;
};
Chatterbox.template.settings.krender.radioitems = function( items ) {
    if( items.length == 0 )
        return '';
    render = '';
    labels = [];
    fields = [];
    
    for( i in items ) {
    
        item = items[i];
        labels.push(Chatterbox.render('settings.item.form.label', {
            'ref': item.value,
            'label': item.title
        }));
        
        ritem = '<div class="'+item.value+' field radio"><input class="'+item.value+'" type="radio" name="'+item.name+'" value="' + item.value + '"'
        if( item.selected ) {
            ritem+= ' checked="yes"';
        }
        fields.push(ritem + ' /></div>');
    
    }
    
    return '<section class="labels">' + labels.join('') + '</section><section class="fields">' + fields.join('') + '</section>';
};
Chatterbox.template.settings.krender.checkitems = function( items ) {
    if( items.length == 0 )
        return '';
    render = '';
    labels = [];
    fields = [];
    
    for( i in items ) {
    
        item = items[i];
        if( 'title' in item ) {
            labels.push(Chatterbox.render('settings.item.form.label', {
                'ref': item.value,
                'label': item.title
            }));
        }
        
        ritem = '<div class="'+item.value+' field check"><input class="'+item.value+'" type="checkbox" name="'+item.name+'" value="' + item.value + '"'
        if( item.selected ) {
            ritem+= ' checked="yes"';
        }
        fields.push(ritem + ' /></div>');
    
    }
    
    if( labels.length > 0 ) {
        render+= '<section class="labels">' + labels.join('') + '</section>';
    }
    
    return render + '<section class="fields">' + fields.join('') + '</section>';
};

Chatterbox.template.settings.item = {};
Chatterbox.template.settings.item.get = function( type ) {

    var tp = type.split('.');
    var item = Chatterbox.template.settings.item;
    
    for( i in tp ) {
        tc = tp[i];
        if( item.hasOwnProperty(tc) ) {
            item = item[tc];
            continue;
        }
        return null;
    }
    
    return item;

};

Chatterbox.template.settings.item.wrap = '<section class="item {type} {ref}{class}">\
                                    {content}\
                                </section>';
                                
Chatterbox.template.settings.item.hint = {};
Chatterbox.template.settings.item.hint.frame = '<aside class="hint">{hint}</aside>{content}';
Chatterbox.template.settings.item.hint.prep = function( html, data ) {

    if( !data.hasOwnProperty('hint') )
        return html;
    
    return Chatterbox.render('settings.item.hint', {
        'hint': data.hint,
        'content': html
    });

};

Chatterbox.template.settings.item.twopane = {};
Chatterbox.template.settings.item.twopane.frame = '{title}<div class="twopane">\
                                        <div class="text left">\
                                            <p>{text}</p>\
                                        </div>\
                                        <div class="right">\
                                            {template}\
                                        </div>\
                                    </div>';

Chatterbox.template.settings.item.twopane.wrap = function( html, data ) {

    if( !data.hasOwnProperty('text') )
        return html;
    
    html = replaceAll(
        Chatterbox.template.settings.item.twopane.frame, 
        '{template}',
        replaceAll(html, '{title}', '')
    );
    
    return html;

};

Chatterbox.template.settings.item.text = {};
Chatterbox.template.settings.item.text.pre = Chatterbox.template.settings.item.hint.prep;
Chatterbox.template.settings.item.text.post = Chatterbox.template.clean(['title', 'text']);
Chatterbox.template.settings.item.text.render = {
    'title': Chatterbox.template.settings.krender.title,
    'text': Chatterbox.template.settings.krender.text
};

Chatterbox.template.settings.item.text.frame = '{title}<p>\
                                        {text}\
                                    </p>';

Chatterbox.template.settings.item.dropdown = {};
Chatterbox.template.settings.item.dropdown.pre = [
    Chatterbox.template.settings.item.twopane.wrap,
    Chatterbox.template.settings.item.hint.prep
];

Chatterbox.template.settings.item.dropdown.render = {
    'title': Chatterbox.template.settings.krender.title,
    'text': Chatterbox.template.settings.krender.text,
    'items': Chatterbox.template.settings.krender.dditems
};

Chatterbox.template.settings.item.dropdown.post = Chatterbox.template.clean(['title', 'items']);
Chatterbox.template.settings.item.dropdown.events = [['change', 'select'],['inspect', 'select']];
Chatterbox.template.settings.item.dropdown.frame = '{title}<form>\
                                                <select>\
                                                    {items}\
                                                </select>\
                                            </form>';

Chatterbox.template.settings.item.radio = {};
Chatterbox.template.settings.item.radio.pre = [
    Chatterbox.template.settings.item.twopane.wrap,
    Chatterbox.template.settings.item.hint.prep
];

Chatterbox.template.settings.item.radio.render = {
    'title': Chatterbox.template.settings.krender.title,
    'text': Chatterbox.template.settings.krender.text,
    'items': Chatterbox.template.settings.krender.radioitems
};

Chatterbox.template.settings.item.radio.post = Chatterbox.template.clean(['ref', 'title', 'items']);
Chatterbox.template.settings.item.radio.events = [['change', 'input:radio'],['inspect', 'input:radio']];
Chatterbox.template.settings.item.radio.frame = '{title}<div class="{ref} radiobox"><form>{items}</form></div>';

Chatterbox.template.settings.item.check = {};
Chatterbox.template.settings.item.check.pre = [
    Chatterbox.template.settings.item.twopane.wrap,
    Chatterbox.template.settings.item.hint.prep
];

Chatterbox.template.settings.item.check.render = {
    'title': Chatterbox.template.settings.krender.title,
    'text': Chatterbox.template.settings.krender.text,
    'items': Chatterbox.template.settings.krender.checkitems
};

Chatterbox.template.settings.item.check.post = Chatterbox.template.clean(['ref', 'title', 'items']);
Chatterbox.template.settings.item.check.events = [['change', 'input:checkbox'],['inspect', 'input:checkbox']];
Chatterbox.template.settings.item.check.frame = '{title}<div class="{ref} checkbox"><form>{items}</form></div>';

Chatterbox.template.settings.item.textfield = {};
Chatterbox.template.settings.item.textfield.pre = [
    Chatterbox.template.settings.item.twopane.wrap,
    Chatterbox.template.settings.item.hint.prep
];

Chatterbox.template.settings.item.textfield.render = {
    'title': Chatterbox.template.settings.krender.title,
    'text': Chatterbox.template.settings.krender.text
};

Chatterbox.template.settings.item.textfield.post = Chatterbox.template.clean(['ref', 'title', 'default']);
Chatterbox.template.settings.item.textfield.events = [['blur', 'input'],['inspect', 'input']];
Chatterbox.template.settings.item.textfield.frame = '{title}<div class="{ref} textfield"><form><input type="text" value="{default}" /></form></div>';

Chatterbox.template.settings.item.textarea = {};
Chatterbox.template.settings.item.textarea.pre = [
    Chatterbox.template.settings.item.twopane.wrap,
    Chatterbox.template.settings.item.hint.prep
];

Chatterbox.template.settings.item.textarea.render = {
    'title': Chatterbox.template.settings.krender.title,
    'text': Chatterbox.template.settings.krender.text
};

Chatterbox.template.settings.item.textarea.post = Chatterbox.template.clean(['ref', 'title', 'default']);
Chatterbox.template.settings.item.textarea.events = [['blur', 'textarea'],['inspect', 'textarea']];
Chatterbox.template.settings.item.textarea.frame = '{title}<div class="{ref} textarea"><form><textarea rows="4" cols="20" value="{default}"></textarea></form></div>';

Chatterbox.template.settings.item.form = {};
Chatterbox.template.settings.item.form.pre = [
    Chatterbox.template.settings.item.twopane.wrap,
    Chatterbox.template.settings.item.hint.prep
];

Chatterbox.template.settings.item.form.render = {
    'title': Chatterbox.template.settings.krender.title,
    'text': Chatterbox.template.settings.krender.text,
    'items': Chatterbox.template.settings.krender.dditems
};

Chatterbox.template.settings.item.form.post = Chatterbox.template.clean(['title', 'text', 'items']);
//Chatterbox.template.settings.item.form.events = [['change', 'select'],['inspect', 'select']];
Chatterbox.template.settings.item.form.frame = '{title}<form>\
                                                <section class="labels"></section>\
                                                <section class="fields"></section>\
                                            </form>';

Chatterbox.template.settings.item.form.label = {};
Chatterbox.template.settings.item.form.label.post = Chatterbox.template.clean(['ref', 'label', 'class']);
Chatterbox.template.settings.item.form.label.frame = '<div class="{ref} label{class}"><label for="{ref}">{label}</label></div>';

Chatterbox.template.settings.item.form.field = {};
Chatterbox.template.settings.item.form.field.wrap = {};
Chatterbox.template.settings.item.form.field.wrap.post = Chatterbox.template.clean(['ref', 'field']);
Chatterbox.template.settings.item.form.field.wrap.frame = '<div class="{ref} field">{field}</div>';

Chatterbox.template.settings.item.form.field.dropdown = {};
Chatterbox.template.settings.item.form.field.dropdown.render = { 'items': Chatterbox.template.settings.krender.dditems };
Chatterbox.template.settings.item.form.field.dropdown.post = Chatterbox.template.clean(['ref', 'items']);
Chatterbox.template.settings.item.form.field.dropdown.frame = '<select class="{ref}">{items}</select>';

Chatterbox.template.settings.item.form.field.textfield = {};
Chatterbox.template.settings.item.form.field.textfield.post = Chatterbox.template.clean(['ref', 'default']);
Chatterbox.template.settings.item.form.field.textfield.frame = '<input class="{ref}" type="text" value="{default}" />';

Chatterbox.template.settings.item.form.field.textarea = {};
Chatterbox.template.settings.item.form.field.textarea.post = Chatterbox.template.clean(['ref', 'default']);
Chatterbox.template.settings.item.form.field.textarea.frame = '<textarea class="{ref}" rows="4" cols="20" value="{default}"></textarea>';

Chatterbox.template.settings.item.form.field.radio = {};
Chatterbox.template.settings.item.form.field.radio.render = { 'items': Chatterbox.template.settings.krender.radioitems };
Chatterbox.template.settings.item.form.field.radio.post = Chatterbox.template.clean(['ref', 'items']);
Chatterbox.template.settings.item.form.field.radio.frame = '<div class="{ref} radiobox">{items}</div>';

Chatterbox.template.settings.item.form.field.check = {};
Chatterbox.template.settings.item.form.field.check.render = { 'items': Chatterbox.template.settings.krender.checkitems };
Chatterbox.template.settings.item.form.field.check.post = Chatterbox.template.clean(['ref', 'items']);
Chatterbox.template.settings.item.form.field.check.frame = '<div class="{ref} checkbox">{items}</div>';



