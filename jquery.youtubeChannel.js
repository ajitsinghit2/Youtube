
;(function(){
	$.fn.youtubeChannel = function(settings) {
		var $youtubeEl	= $(this),
			$youtubeList	= $('<ul/>',{class:'youtube-channel-list'});
			options	= $.extend({}, {username:'',query:'',startIndex:1,maxResults:10,orderBy:'published'}, settings),
			videos	= [],
			// accessory functions
			getTitle	= function() {
				if (options.username!=='') {
					return ['<a href="http://www.youtube.com/user/',options.username,'" target="_blank">',options.username,'</a>'].join('');
				}
				else if (options.query!=='') {
					http://www.youtube.com/results?search_query=test%20query&aq=f
					return ['<a href="http://www.youtube.com/results?',encodeURIComponent(options.query),'&aq=f" target="_blank">&quot;',options.query,'&quot;</a>'].join('');
				}
				else {
					return '<a href="http://www.youtube.com/" target="_blank">YouTube</a>';
				}
			},
			
			buildUrl	= function() {
				var base	= 'https://gdata.youtube.com/feeds/api/videos',
					params	= ['alt=json','orderby='+options.orderBy,'start-index='+options.startIndex,'max-results='+options.maxResults];
				if (options.username!=='') {
					params.push('author='+options.username);
				}
				else if (options.query!=='') {
					params.push('q='+encodeURIComponent(options.query));
				}
				return base+'?'+params.join('&');
			},
			parseTime	= function(secs) {
				var m,s = parseInt(secs,10);
				m = Math.floor(s / 60);
				s -= (m * 60);
				return m+':'+s;
			};
		// setup the html
		$youtubeEl.addClass('youtube-channel-holder');
		$youtubeList.appendTo($youtubeEl);
		// parse the feed
		$.getJSON(buildUrl(),function(data) {
			// add the header
			$('<li/>',{class:'youtube-channel-title'}).html(getTitle()).appendTo($youtubeList);
			if (data.feed.entry) {
				// add the items
				for (var i=0; i<data.feed.entry.length; i++) {
					var html,vid,e = data.feed.entry[i];
					vid		= {
						link:		(e ? e.media$group.media$player[0].url : ''),
						title:		(e ? e.media$group.media$title.$t : ''),
						thumb:		(e ? e.media$group.media$thumbnail[0].url : ''),
						duration:	(e ? e.media$group.yt$duration.seconds : 0),
						views:		(e && e.yt$statistics ? e.yt$statistics.viewCount : 0)
					};
					html	= $('<li/>',{class:'youtube-channel-video'})
							.html([
								'<a target="_blank" href="',vid.link,'">',
									'<span class="thumb-wrap">',
										'<img class="vid-thumb" alt="',vid.title,'" src="',vid.thumb,'"/>',
									'</span>',
									'<div class="vid-details">',
										'<span class="vid-title">',vid.title,'</span>',
										'<span class="vid-views">',vid.views,' </span>',
										//'<span class="vid-duration">',vid.duration,'</span>',
									'</div>',
								'</a>'
							].join(''));
					videos.push(vid);
					html.appendTo($youtubeList);
				}
			} else {
				$('<li/>',{class:'youtube-channel-video'})
					.html('<a>NO RESULTS</a>').appendTo($youtubeList);
			}
		});
		return this;
	};
})(jQuery);