/**
 * https://www.reddit.com/dev/api/
 */

class RedditApi {
  host: string;
  parameters: { limit: string; include_over_18: string; comment?: string };
  search_params: { limit: string; include_over_18: string; type: string };

  constructor() {
    this.host = 'https://www.reddit.com';
    this.parameters = {
      limit: '25',
      include_over_18: 'true',
    };
    this.search_params = {
      limit: '25',
      include_over_18: 'true',
      type: 'sr,link,user',
    };
  }

  async getSubmissions(
    sort: string | undefined | null = null,
    subreddit: string | undefined | null = null,
    options: Record<string, string> = {}
  ) {
    const params = {
      limit: 25,
      include_over_18: true,
    };

    const notNullSort = sort ?? 'hot';
    const notNullSubreddit = subreddit ? '/r/' + subreddit : '';
    console.log(
      '[calling]',
      this.host +
        notNullSubreddit +
        `/${notNullSort}.json?` +
        new URLSearchParams(Object.assign(params, options))
    );
    return await fetch(
      this.host +
        notNullSubreddit +
        `/${notNullSort}.json?` +
        new URLSearchParams(Object.assign(params, options))
    )
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        posts: data.children,
      }))
      .catch(() => null);
  }

  async getDomainHot(domain: string, options: Record<string, string> = this.parameters) {
    return await fetch(
      this.host + '/domain/' + domain + '/hot.json?' + new URLSearchParams(options)
    )
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        posts: data.children,
      }))
      .catch(() => null);
  }

  async getDomainBest(domain: string, options = this.parameters) {
    return await fetch(
      this.host + '/domain/' + domain + '/best.json?' + new URLSearchParams(options)
    )
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        posts: data.children,
      }))
      .catch(() => null);
  }

  async getDomainTop(domain: string, options = this.parameters) {
    return await fetch(
      this.host + '/domain/' + domain + '/top.json?' + new URLSearchParams(options)
    )
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        posts: data.children,
      }))
      .catch(() => null);
  }

  async getDomainNew(domain: string, options = this.parameters) {
    return await fetch(
      this.host + '/domain/' + domain + '/new.json?' + new URLSearchParams(options)
    )
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        posts: data.children,
      }))
      .catch(() => null);
  }

  async getDomainRising(domain: string, options = this.parameters) {
    return await fetch(
      this.host + '/domain/' + domain + '/rising.json?' + new URLSearchParams(options)
    )
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        posts: data.children,
      }))
      .catch(() => null);
  }

  async getDomainControversial(domain: string, options = this.parameters) {
    return await fetch(
      this.host + '/domain/' + domain + '/controversial.json?' + new URLSearchParams(options)
    )
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        posts: data.children,
      }))
      .catch(() => null);
  }

  async getSubreddit(subreddit: string) {
    console.log('[calling]', this.host + '/r/' + subreddit + '/about.json');
    return await fetch(this.host + '/r/' + subreddit + '/about.json')
      .then((res) => res.json())
      .then((json) => json.data)
      .catch(() => null);
  }

  async getSubredditRules(subreddit: string) {
    return await fetch(this.host + '/r/' + subreddit + '/about/rules.json')
      .then((res) => res.json())
      .then((json) => json.data)
      .catch(() => null);
  }

  async getSubredditModerators(subreddit: string) {
    return await fetch(this.host + '/r/' + subreddit + '/about/moderators.json')
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        users: data.children,
      }))
      .catch(() => null);
  }

  async getSubredditWikiPages(subreddit: string) {
    return await fetch(this.host + '/r/' + subreddit + '/wiki/pages.json')
      .then((res) => res.json())
      .then((json) => json.data)
      .catch(() => null);
  }

  async getSubredditWikiPage(subreddit: string, page: string) {
    console.log('[calling]', this.host + '/r/' + subreddit + '/wiki/' + page + '.json');
    return await fetch(this.host + '/r/' + subreddit + '/wiki/' + page + '.json')
      .then((res) => res.json())
      .then((json) => json.data)
      .catch(() => null);
  }

  async getSubredditWikiPageRevisions(subreddit: string, page: number) {
    return await fetch(this.host + '/r/' + subreddit + '/wiki/revisions' + page + '.json')
      .then((res) => res.json())
      .then((json) => json.data.children)
      .catch(() => null);
  }

  async getPopularSubreddits(options = this.parameters) {
    return await fetch(this.host + '/subreddits/popular.json?' + new URLSearchParams(options))
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        subreddits: data.children,
      }))
      .catch(() => null);
  }

  async getNewSubreddits(options = this.parameters) {
    return await fetch(this.host + '/subreddits/new.json?' + new URLSearchParams(options))
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        subreddits: data.children,
      }))
      .catch(() => null);
  }

  async getPremiumSubreddits(options = this.parameters) {
    return await fetch(this.host + '/subreddits/premium.json?' + new URLSearchParams(options))
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        subreddits: data.children,
      }))
      .catch(() => null);
  }

  async getDefaultSubreddits(options = this.parameters) {
    return await fetch(this.host + '/subreddits/default.json?' + new URLSearchParams(options))
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        subreddits: data.children,
      }))
      .catch(() => null);
  }

  async getPopularUsers(options = this.parameters) {
    return await fetch(this.host + '/users/popular.json?' + new URLSearchParams(options))
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        users: data.children,
      }))
      .catch(() => null);
  }

  async getNewUsers(options = this.parameters) {
    return await fetch(this.host + '/users/new.json?' + new URLSearchParams(options))
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        users: data.children,
      }))
      .catch(() => null);
  }

  async searchSubmissions(
    query: string,
    subreddit: string | null | undefined,
    options: Record<string, string> = {}
  ) {
    options.q = query;
    if (subreddit) {
      options.restrict_sr = 'on';
    }
    options.type = 'link';

    const params = {
      limit: 25,
      include_over_18: true,
    };
    subreddit = subreddit ? '/r/' + subreddit : '';
    console.log(
      this.host + subreddit + '/search.json?' + new URLSearchParams(Object.assign(params, options))
    );

    return await fetch(
      this.host + subreddit + '/search.json?' + new URLSearchParams(Object.assign(params, options))
    )
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        items: data.children,
      }))
      .catch(() => null);
  }

  async searchSubreddits(query: string, options: Record<string, string> = {}) {
    options.q = query;

    const params = {
      limit: 25,
      include_over_18: true,
    };

    console.log(
      ['search'],
      this.host + '/subreddits/search.json?' + new URLSearchParams(Object.assign(params, options))
    );

    return await fetch(
      this.host + '/subreddits/search.json?' + new URLSearchParams(Object.assign(params, options))
    )
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        items: data.children,
      }))
      .catch(() => null);
  }

  async searchUsers(query: string, options: Record<string, string> = {}) {
    options.q = query;

    const params = {
      limit: 25,
      include_over_18: true,
    };

    console.log(
      ['search'],
      this.host + '/users/search.json?' + new URLSearchParams(Object.assign(params, options))
    );

    return await fetch(
      this.host + '/users/search.json?' + new URLSearchParams(Object.assign(params, options))
    )
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        items: data.children,
      }))
      .catch(() => null);
  }

  async searchAll(
    query: string,
    subreddit: string | undefined | null = null,
    options: Record<string, string> = {}
  ) {
    options.q = query;
    subreddit = subreddit ? '/r/' + subreddit : '';

    const params = {
      limit: 25,
      include_over_18: true,
      type: 'sr,link,user',
    };

    return await fetch(
      this.host + subreddit + '/search.json?' + new URLSearchParams(Object.assign(params, options))
    )
      .then((res) => res.json())
      .then((json) =>
        Array.isArray(json)
          ? {
              after: json[1].data.after,
              items: json[0].data.children.concat(json[1].data.children),
            }
          : {
              after: json.data.after,
              items: json.data.children,
            }
      )
      .catch(() => null);
  }

  async getSubmission(id: string) {
    return await fetch(this.host + '/by_id/' + id + '.json')
      .then((res) => res.json())
      .then((json) => json.data.children[0].data)
      .catch(() => null);
  }

  async getSubmissionComments(id: string, options = this.parameters) {
    console.log(
      '[calling]',
      this.host + '/comments/' + id + '.json?' + new URLSearchParams(options)
    );

    return await fetch(this.host + '/comments/' + id + '.json?' + new URLSearchParams(options))
      .then((res) => res.json())
      .then((json) => ({
        submission: json[0].data.children[0],
        comments: json[1].data.children,
      }))
      .catch(() => null);
  }

  async getSubredditComments(subreddit: string, options = this.parameters) {
    return await fetch(
      this.host + '/r/' + subreddit + '/comments.json?' + new URLSearchParams(options)
    )
      .then((res) => res.json())
      .then((json) => json.data.children)
      .catch(() => null);
  }

  async getUser(username: string) {
    console.log('[calling]', this.host + '/user/' + username + '/about.json');
    return await fetch(this.host + '/user/' + username + '/about.json')
      .then((res) => res.json())
      .then((json) => json.data)
      .catch(() => null);
  }

  async getUserTrophies(username: string) {
    console.log('[calling]', this.host + '/user/' + username + '/trophies.json');
    return await fetch(this.host + '/user/' + username + '/trophies.json')
      .then((res) => res.json())
      .then((json) => json.data.trophies)
      .catch(() => null);
  }

  async getUserOverview(username: string, options = this.parameters) {
    console.log(
      '[calling]',
      this.host + '/user/' + username + '/overview.json?' + new URLSearchParams(options)
    );
    return await fetch(
      this.host + '/user/' + username + '/overview.json?' + new URLSearchParams(options)
    )
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        items: data.children,
      }))
      .catch(() => null);
  }

  async getUserComments(username: string, options = this.parameters) {
    return await fetch(
      this.host + '/user/' + username + '/comments.json?' + new URLSearchParams(options)
    )
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        items: data.children,
      }))
      .catch(() => null);
  }

  async getUserSubmissions(username: string, options = this.parameters) {
    return await fetch(
      this.host + '/user/' + username + '/submitted.json?' + new URLSearchParams(options)
    )
      .then((res) => res.json())
      .then((json) => json.data)
      .then((data) => ({
        after: data.after,
        items: data.children,
      }))
      .catch(() => null);
  }

  async getLiveThread(id: string) {
    return await fetch(this.host + '/live/' + id + '/about.json')
      .then((res) => res.json())
      .then((json) => json.data)
      .catch(() => null);
  }

  async getLiveThreadUpdates(id: string, options = this.parameters) {
    return await fetch(this.host + '/live/' + id + '.json?' + new URLSearchParams(options))
      .then((res) => res.json())
      .then((json) => json.data.children)
      .catch(() => null);
  }

  async getLiveThreadContributors(id: string, options = this.parameters) {
    return await fetch(
      this.host + '/live/' + id + '/contributors.json?' + new URLSearchParams(options)
    )
      .then((res) => res.json())
      .then((json) => json.data.children)
      .catch(() => null);
  }

  async getLiveThreadDiscussions(id: string, options = this.parameters) {
    return await fetch(
      this.host + '/live/' + id + '/discussions.json?' + new URLSearchParams(options)
    )
      .then((res) => res.json())
      .then((json) => json.data.children)
      .catch(() => null);
  }

  async getLiveThreadsNow(options = this.parameters) {
    return await fetch(this.host + '/live/happening_now.json?' + new URLSearchParams(options))
      .then((res) => res.json())
      .then((json) => json.data.children)
      .catch(() => null);
  }
}

type Comment =
  | {
      kind: 't1';
      data: {
        subreddit_id: string;
        approved_at_utc: number | null;
        author_is_blocked: boolean;
        comment_type: string | null;
        awarders: string[];
        mod_reason_by: string | null;
        banned_by: string | null;
        author_flair_type: 'text' | 'richtext';
        total_awards_received: number;
        subreddit: string;
        author_flair_template_id: string | null;
        likes: null;
        replies: undefined | '' | CommentReply;
        user_reports: string[];
        saved: boolean;
        id: string;
        banned_at_utc: number | null;
        mod_reason_title: string | null;
        gilded: number;
        archived: boolean;
        collapsed_reason_code: number | null;
        no_follow: boolean;
        author: string;
        can_mod_post: boolean;
        created_utc: number;
        send_replies: boolean;
        parent_id: string;
        score: number;
        author_fullname: string;
        approved_by: string | null;
        mod_note: string | null;
        all_awardings: string[];
        collapsed: boolean;
        body: string;
        edited: boolean;
        top_awarded_type: string | null;
        author_flair_css_class: string | null;
        name: string;
        is_submitter: false;
        downs: number;
        author_flair_richtext: FlairRichText[];
        author_patreon_flair: false;
        body_html: string;
        removal_reason: string | null;
        collapsed_reason: string | null;
        distinguished: string | null;
        associated_award: string | null;
        stickied: boolean;
        author_premium: boolean;
        can_gild: boolean;
        gildings: any;
        unrepliable_reason: string | null;
        author_flair_text_color: string | null;
        score_hidden: boolean;
        permalink: string;
        subreddit_type: string;
        locked: boolean;
        report_reasons: string | null;
        created: number;
        author_flair_text: string | null;
        treatment_tags: string[];
        link_id: string; // post id
        subreddit_name_prefixed: string;
        controversiality: number;
        depth: number;
        author_flair_background_color: string | null;
        collapsed_because_crowd_control: string | null;
        mod_reports: string[];
        num_reports: number | null;
        ups: number;
        media_metadata?: Record<string, RedditMediaMedata>;
      };
    }
  | {
      kind: 'more';
      data: {
        count: 5;
        name: string;
        id: string;
        parent_id: string;
        depth: 1;
        children: string[];
      };
    };

type CommentReply = {
  kind: string;
  data: {
    after: string | null;
    dist: string | null;
    modhash: string;
    geo_filter: string;
    children: Comment[];
  };
};

type RedditMediaMedata = {
  status: string;
  e: string;
  m: string;
  p: { y: number; x: number; u: string }[];
  s: { y: number; x: number; u: string; gif?: string; mp4?: string };
  id: string;
  t?: string;
  ext?: string;
};

type PollData = {
  voting_end_timestamp: number;
  total_vote_count: number;
  options: { id: string; text: string; vote_count?: number }[];
};

type RedditVideo = {
  bitrate_kbps: number;
  fallback_url: string;
  has_audio: boolean;
  height: number;
  width: number;
  scrubber_media_url: string;
  dash_url: string;
  duration: number;
  hls_url: string;
  is_gif: boolean;
  transcoding_status: string;
};

type FlairRichText =
  | {
      a: string;
      e: 'emoji';
      u: string;
    }
  | {
      e: 'text';
      t: string;
    };

type Post = {
  kind: 't3';
  data: {
    approved_at_utc: string | null;
    subreddit: string;
    selftext: string;
    author_fullname: string;
    saved: boolean;
    mod_reason_title: string | null;
    gilded: number;
    clicked: boolean;
    is_gallery?: boolean;
    title: string;
    link_flair_richtext: string | FlairRichText[];
    subreddit_name_prefixed: string;
    hidden: boolean;
    pwls: number /** ??? */;
    link_flair_css_class: string;
    downs: number;
    thumbnail_height: number | null;
    top_awarded_type: string | null;
    hide_score: boolean;
    media_metadata?: Record<string, RedditMediaMedata>;
    gallery_data?: {
      items: { media_id: string; id: string }[];
    };
    name: string;
    quarantine: boolean;
    link_flair_text_color: string;
    upvote_ratio: number;
    author_flair_background_color: string | null;
    subreddit_type: string;
    ups: number;
    total_awards_received: number;
    media_embed: any;
    thumbnail_width: number | null;
    author_flair_template_id: string;
    is_original_content: boolean;
    user_reports: string[];
    secure_media: null | { reddit_video: RedditVideo };
    is_reddit_media_domain: boolean;
    is_meta: boolean;
    category: string | null;
    secure_media_embed: any;
    link_flair_text: string;
    can_mod_post: boolean;
    score: number;
    approved_by: null;
    is_created_from_ads_ui: boolean;
    author_premium: boolean;
    thumbnail: string;
    edited: boolean;
    author_flair_css_class: null;
    author_flair_richtext: FlairRichText[];
    gildings: any;
    content_categories: null;
    is_self: boolean;
    mod_note: string | null;
    created: number;
    link_flair_type: 'text' | 'richtext'; // text | richtext
    wls: number /** ??? */;
    removed_by_category: null;
    banned_by: null;
    author_flair_type: 'text' | 'richtext';
    domain: string;
    allow_live_comments: boolean;
    selftext_html: string;
    likes: null;
    suggested_sort: string;
    banned_at_utc: number | null;
    url_ovidden_by_dest?: string | null;
    view_count: number | null;
    archived: boolean;
    no_follow: boolean;
    is_crosspostable: boolean;
    pinned: boolean;
    over_18: boolean;
    preview:
      | {
          images: {
            source: { url: string; width: number; height: number };
            resolutions: { url: string; width: number; height: number }[];
            id: string;
          }[];
          reddit_video_preview?: RedditVideo;
          enabled: false;
        }
      | undefined;
    all_awardings: [];
    awarders: [];
    media_only: boolean;
    link_flair_template_id: string;
    can_gild: boolean;
    spoiler: boolean;
    locked: boolean;
    author_flair_text: string;
    treatment_tags: [];
    visited: boolean;
    removed_by: null;
    num_reports: null;
    distinguished: null;
    subreddit_id: string;
    author_is_blocked: boolean;
    mod_reason_by: null;
    removal_reason: null;
    link_flair_background_color: string | null;
    id: string;
    is_robot_indexable: boolean;
    report_reasons: null;
    author: string;
    discussion_type: null;
    num_comments: number;
    send_replies: boolean;
    whitelist_status: string;
    contest_mode: false;
    mod_reports: [];
    author_patreon_flair: false;
    author_flair_text_color: string;
    permalink: string;
    parent_whitelist_status: string;
    stickied: boolean;
    url: string;
    subreddit_subscribers: number;
    created_utc: number;
    num_crossposts: number;
    media:
      | string
      | null
      | {
          reddit_video: RedditVideo;
        };
    is_video: boolean;
    crosspost_parent_list?: [Post['data']];
    poll_data?: PollData;
  };
};

type Trophy = {
  kind: 't6';
  data: {
    icon_70: string;
    granted_at: number;
    url: string | null;
    icon_40: string;
    name: string;
    award_id: string | null;
    id: string | null;
    description: string | null;
  };
};

type TrophyList = {
  kind: 'TrophyList';
  data: {
    trophies: Trophy[];
  };
};

type SubReddit = {
  kind: 't5';
  data: {
    id: string;
    community_icon?: string;
    icon?: string;
    title: string;
    display_name: string;
    display_name_prefixed: string;
    over18: boolean;
    public_description: string;
    public_description_html: string;
    subreddit_type: 'public' | 'private' | 'restricted';
    subscribers: number | null;
  };
};

type User = {
  kind: 't2';
  data: {
    id: string;
    is_suspended: boolean;
    verified: boolean;
    is_gold: boolean;
    is_mod: boolean;
    link_karma: number;
    total_karma: number;
    comment_karma: number;
    icon_img: string;
    snoovatar_img: string;
    name: string;
    created_utc: number;
    pref_show_snoovatar: boolean;
    subreddit: {
      banner_img: string;
      over_18: boolean;
      icon_img: string;
      public_description: string;
      subreddit_type: 'user';
    };
  };
};

// t1 (Comment)
// t2 (User)
// t3 (Post)
// t5 (Subreddit)
// t6 (Trophy)

export {
  Comment,
  CommentReply,
  FlairRichText,
  Post,
  RedditApi,
  RedditMediaMedata,
  RedditVideo,
  SubReddit,
  Trophy,
  TrophyList,
  User,
};
