-- Update RSS sources in admin_settings with comprehensive feed collection
INSERT INTO admin_settings (setting_key, setting_value, description)
VALUES (
  'rss_sources',
  '[
    {"name": "Sky Sports", "url": "https://www.skysports.com/rss/12040", "category": "sports"},
    {"name": "NPR", "url": "https://feeds.npr.org/1001/rss.xml", "category": "politics"},
    {"name": "ESPN", "url": "https://www.espn.com/espn/rss/news", "category": "sports"},
    {"name": "NYTimes Technology", "url": "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", "category": "technology"},
    {"name": "Fox News Entertainment", "url": "https://feeds.foxnews.com/foxnews/entertainment", "category": "entertainment"},
    {"name": "Rolling Stone", "url": "https://www.rollingstone.com/music/music-news/feed/", "category": "entertainment"},
    {"name": "NYTimes Health", "url": "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml", "category": "wellness"},
    {"name": "US Dept of State Travel", "url": "https://travel.state.gov/content/travel/en/rss.html", "category": "travel"},
    {"name": "Travel & Tour World", "url": "https://feeds.feedburner.com/travelandtourworld/home", "category": "travel"},
    {"name": "Oxford Academic Connect", "url": "https://global.oup.com/academic/connect/rss/", "category": "academics"},
    {"name": "Fox Entertainment", "url": "https://moxie.foxnews.com/google-publisher/entertainment.xml", "category": "entertainment"},
    {"name": "Oxford Academic RSS 1", "url": "https://academic.oup.com/rss/site_5375/3236_56068.xml", "category": "wellness"},
    {"name": "Oxford Academic RSS 2", "url": "https://academic.oup.com/rss/site_5375/3236.xml", "category": "wellness"},
    {"name": "Oxford Academic Advance", "url": "https://academic.oup.com/rss/site_5375/advanceAccess_3236.xml", "category": "wellness"},
    {"name": "Oxford Open Access", "url": "https://academic.oup.com/rss/site_5375/OpenAccess.xml", "category": "wellness"},
    {"name": "Oxford Academic RSS 3", "url": "https://academic.oup.com/rss/site_5375/3236_56069.xml", "category": "wellness"},
    {"name": "Oxford Podcast", "url": "https://academic.oup.com/rss/site_5375/Podcast.xml", "category": "technology"},
    {"name": "Newswise Science", "url": "https://feeds.feedburner.com/NewswiseScinews", "category": "academics"},
    {"name": "Newswise Medical", "url": "https://feeds.feedburner.com/NewswiseMednews", "category": "finance"},
    {"name": "Newswise Business", "url": "https://feeds.feedburner.com/NewswiseBiznews", "category": "politics"},
    {"name": "Newswise Fact Check", "url": "https://feeds.feedburner.com/NewswiseFactchecknews", "category": "wellness"},
    {"name": "Newswise Expert Pitch", "url": "https://feeds.feedburner.com/NewswiseExpertPitch", "category": "technology"},
    {"name": "Newswise Research Alert", "url": "https://feeds.feedburner.com/NewswiseResearchAlertnews", "category": "politics"},
    {"name": "BBC World News", "url": "https://feeds.bbci.co.uk/news/world/rss.xml", "category": "politics"},
    {"name": "CBN News Watch", "url": "http://podcast.cbn.com/rss_latest_cbn_videos.aspx?s=newswatchepisodes", "category": "finance"},
    {"name": "CBN Finance", "url": "http://podcast.cbn.com/rss_latest_cbn_videos.aspx?s=Finance", "category": "entertainment"},
    {"name": "CBN Entertainment", "url": "http://podcast.cbn.com/rss_latest_cbn_videos.aspx?s=Entertainment", "category": "technology"},
    {"name": "BBC Technology", "url": "https://feeds.bbci.co.uk/news/technology/rss.xml", "category": "local"},
    {"name": "BBC News", "url": "https://feeds.bbci.co.uk/news/rss.xml", "category": "finance"},
    {"name": "BBC Business", "url": "https://feeds.bbci.co.uk/news/business/rss.xml", "category": "local"},
    {"name": "Yahoo News", "url": "https://news.yahoo.com/rss/", "category": "local"},
    {"name": "CBN US News", "url": "https://www1.cbn.com/app_feeds/rss/news/rss.php?section=us", "category": "academics"},
    {"name": "Newswise Institution", "url": "https://www.newswise.com/legacy/feed/institution.php?inst=10000927", "category": "sports"},
    {"name": "BBC Cricket", "url": "https://feeds.bbci.co.uk/sport/cricket/rss.xml", "category": "sports"},
    {"name": "BBC Football", "url": "https://feeds.bbci.co.uk/sport/football/rss.xml", "category": "sports"},
    {"name": "BBC Tennis", "url": "https://feeds.bbci.co.uk/sport/tennis/rss.xml", "category": "sports"},
    {"name": "BBC Rugby League", "url": "https://feeds.bbci.co.uk/sport/rugby-league/rss.xml", "category": "entertainment"},
    {"name": "BBC Entertainment Arts", "url": "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml?edition=uk", "category": "technology"},
    {"name": "BBC Tech UK", "url": "https://feeds.bbci.co.uk/news/technology/rss.xml?edition=uk", "category": "technology"}
  ]'::jsonb,
  'RSS feed sources for news aggregation'
)
ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();