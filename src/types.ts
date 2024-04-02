export type Tags = {
  values: Array<{
    name: string;
    type: string;
    message: string;
    date: string;
    tagger: {
      type: string;
      raw: string;
      user: {
        display_name: string;
        links: {
          self: {
            href: string;
          };
          avatar: {
            href: string;
          };
          html: {
            href: string;
          };
        };
        type: string;
        uuid: string;
        account_id: string;
        nickname: string;
      };
    };
    target: {
      type: string;
      hash: string;
      date: string;
      author: {
        type: string;
        raw: string;
        user: {
          display_name: string;
          links: {
            self: {
              href: string;
            };
            avatar: {
              href: string;
            };
            html: {
              href: string;
            };
          };
          type: string;
          uuid: string;
          account_id: string;
          nickname: string;
        };
      };
      message: string;
      links: {
        self: {
          href: string;
        };
        html: {
          href: string;
        };
        diff: {
          href: string;
        };
        approve: {
          href: string;
        };
        comments: {
          href: string;
        };
        statuses: {
          href: string;
        };
        patch: {
          href: string;
        };
      };
      parents: Array<{
        hash: string;
        links: {
          self: {
            href: string;
          };
          html: {
            href: string;
          };
        };
        type: string;
      }>;
      repository: {
        type: string;
        full_name: string;
        links: {
          self: {
            href: string;
          };
          html: {
            href: string;
          };
          avatar: {
            href: string;
          };
        };
        name: string;
        uuid: string;
      };
    };
    links: {
      self: {
        href: string;
      };
      commits: {
        href: string;
      };
      html: {
        href: string;
      };
    };
  }>;
  pagelen: number;
  size: number;
  page: number;
  next: string;
};

export type PullRequests = {
  values: Array<{
    comment_count: number;
    task_count: number;
    type: string;
    id: number;
    title: string;
    description: string;
    state: string;
    merge_commit: any;
    close_source_branch: boolean;
    closed_by: any;
    author: {
      display_name: string;
      links: {
        self: {
          href: string;
        };
        avatar: {
          href: string;
        };
        html: {
          href: string;
        };
      };
      type: string;
      uuid: string;
      account_id: string;
      nickname: string;
    };
    reason: string;
    created_on: string;
    updated_on: string;
    destination: {
      branch: {
        name: string;
      };
      commit: {
        hash: string;
        links: {
          self: {
            href: string;
          };
          html: {
            href: string;
          };
        };
        type: string;
      };
      repository: {
        type: string;
        full_name: string;
        links: {
          self: {
            href: string;
          };
          html: {
            href: string;
          };
          avatar: {
            href: string;
          };
        };
        name: string;
        uuid: string;
      };
    };
    source: {
      branch: {
        name: string;
      };
      commit: {
        hash: string;
        links: {
          self: {
            href: string;
          };
          html: {
            href: string;
          };
        };
        type: string;
      };
      repository: {
        type: string;
        full_name: string;
        links: {
          self: {
            href: string;
          };
          html: {
            href: string;
          };
          avatar: {
            href: string;
          };
        };
        name: string;
        uuid: string;
      };
    };
    links: {
      self: {
        href: string;
      };
      html: {
        href: string;
      };
      commits: {
        href: string;
      };
      approve: {
        href: string;
      };
      "request-changes": {
        href: string;
      };
      diff: {
        href: string;
      };
      diffstat: {
        href: string;
      };
      comments: {
        href: string;
      };
      activity: {
        href: string;
      };
      merge: {
        href: string;
      };
      decline: {
        href: string;
      };
      statuses: {
        href: string;
      };
    };
    summary: {
      type: string;
      raw: string;
      markup: string;
      html: string;
    };
  }>;
  pagelen: number;
  size: number;
  page: number;
};

export type PullRequest = {
  comment_count: number;
  task_count: number;
  type: string;
  id: number;
  title: string;
  description: string;
  rendered: {
    title: {
      type: string;
      raw: string;
      markup: string;
      html: string;
    };
    description: {
      type: string;
      raw: string;
      markup: string;
      html: string;
    };
  };
  state: string;
  merge_commit: any;
  close_source_branch: boolean;
  closed_by: any;
  author: {
    display_name: string;
    links: {
      self: {
        href: string;
      };
      avatar: {
        href: string;
      };
      html: {
        href: string;
      };
    };
    type: string;
    uuid: string;
    account_id: string;
    nickname: string;
  };
  reason: string;
  created_on: string;
  updated_on: string;
  destination: {
    branch: {
      name: string;
    };
    commit: {
      hash: string;
      links: {
        self: {
          href: string;
        };
        html: {
          href: string;
        };
      };
      type: string;
    };
    repository: {
      type: string;
      full_name: string;
      links: {
        self: {
          href: string;
        };
        html: {
          href: string;
        };
        avatar: {
          href: string;
        };
      };
      name: string;
      uuid: string;
    };
  };
  source: {
    branch: {
      name: string;
    };
    commit: {
      hash: string;
      links: {
        self: {
          href: string;
        };
        html: {
          href: string;
        };
      };
      type: string;
    };
    repository: {
      type: string;
      full_name: string;
      links: {
        self: {
          href: string;
        };
        html: {
          href: string;
        };
        avatar: {
          href: string;
        };
      };
      name: string;
      uuid: string;
    };
  };
  reviewers: Array<{
    display_name: string;
    links: {
      self: {
        href: string;
      };
      avatar: {
        href: string;
      };
      html: {
        href: string;
      };
    };
    type: string;
    uuid: string;
    account_id: string;
    nickname: string;
  }>;
  participants: Array<{
    type: string;
    user: {
      display_name: string;
      links: {
        self: {
          href: string;
        };
        avatar: {
          href: string;
        };
        html: {
          href: string;
        };
      };
      type: string;
      uuid: string;
      account_id: string;
      nickname: string;
    };
    role: string;
    approved: boolean;
    state?: string;
    participated_on?: string;
  }>;
  links: {
    self: {
      href: string;
    };
    html: {
      href: string;
    };
    commits: {
      href: string;
    };
    approve: {
      href: string;
    };
    "request-changes": {
      href: string;
    };
    diff: {
      href: string;
    };
    diffstat: {
      href: string;
    };
    comments: {
      href: string;
    };
    activity: {
      href: string;
    };
    merge: {
      href: string;
    };
    decline: {
      href: string;
    };
    statuses: {
      href: string;
    };
  };
  summary: {
    type: string;
    raw: string;
    markup: string;
    html: string;
  };
};

export type PullRequestComments = {
  values: Array<{
    id: number;
    created_on: string;
    updated_on: string;
    content: {
      type: string;
      raw: string;
      markup: string;
      html: string;
    };
    user: {
      display_name: string;
      links: {
        self: {
          href: string;
        };
        avatar: {
          href: string;
        };
        html: {
          href: string;
        };
      };
      type: string;
      uuid: string;
      account_id: string;
      nickname: string;
    };
    deleted: boolean;
    inline: {
      from: any;
      to: number;
      path: string;
    };
    pending: boolean;
    type: string;
    links: {
      self: {
        href: string;
      };
      html: {
        href: string;
      };
      code: {
        href: string;
      };
    };
    pullrequest: {
      type: string;
      id: number;
      title: string;
      links: {
        self: {
          href: string;
        };
        html: {
          href: string;
        };
      };
    };
    parent?: {
      id: number;
      links: {
        self: {
          href: string;
        };
        html: {
          href: string;
        };
      };
    };
  }>;
  pagelen: number;
  size: number;
  page: number;
  next: string;
};

export type PullRequestActivity = {
  values: Array<{
    pull_request: {
      type: string;
      id: number;
      title: string;
      links: {
        self: {
          href: string;
        };
        html: {
          href: string;
        };
      };
    };
    update?: {
      state: string;
      title: string;
      description: string;
      reviewers: Array<{
        display_name: string;
        links: {
          self: {
            href: string;
          };
          avatar: {
            href: string;
          };
          html: {
            href: string;
          };
        };
        type: string;
        uuid: string;
        account_id: string;
        nickname: string;
      }>;
      changes: {
        title?: {
          old: string;
          new: string;
        };
        description?: {
          old: string;
          new: string;
        };
        reviewers?: {
          added?: Array<{
            display_name: string;
            links: {
              self: {
                href: string;
              };
              avatar: {
                href: string;
              };
              html: {
                href: string;
              };
            };
            type: string;
            uuid: string;
            account_id: string;
            nickname: string;
          }>;
          removed?: Array<{
            display_name: string;
            links: {
              self: {
                href: string;
              };
              avatar: {
                href: string;
              };
              html: {
                href: string;
              };
            };
            type: string;
            uuid: string;
            account_id: string;
            nickname: string;
          }>;
        };
        status?: {
          old: string;
          new: string;
        };
      };
      reason: string;
      author: {
        display_name: string;
        links: {
          self: {
            href: string;
          };
          avatar: {
            href: string;
          };
          html: {
            href: string;
          };
        };
        type: string;
        uuid: string;
        account_id: string;
        nickname: string;
      };
      date: string;
      destination: {
        branch: {
          name: string;
        };
        commit: {
          hash: string;
          links: {
            self: {
              href: string;
            };
            html: {
              href: string;
            };
          };
          type: string;
        };
        repository: {
          type: string;
          full_name: string;
          links: {
            self: {
              href: string;
            };
            html: {
              href: string;
            };
            avatar: {
              href: string;
            };
          };
          name: string;
          uuid: string;
        };
      };
      source: {
        branch: {
          name: string;
        };
        commit: {
          hash: string;
          links: {
            self: {
              href: string;
            };
            html: {
              href: string;
            };
          };
          type: string;
        };
        repository: {
          type: string;
          full_name: string;
          links: {
            self: {
              href: string;
            };
            html: {
              href: string;
            };
            avatar: {
              href: string;
            };
          };
          name: string;
          uuid: string;
        };
      };
    };
    comment?: {
      id: number;
      created_on: string;
      updated_on: string;
      content: {
        type: string;
        raw: string;
        markup: string;
        html: string;
      };
      user: {
        display_name: string;
        links: {
          self: {
            href: string;
          };
          avatar: {
            href: string;
          };
          html: {
            href: string;
          };
        };
        type: string;
        uuid: string;
        account_id: string;
        nickname: string;
      };
      deleted: boolean;
      parent: {
        id: number;
        links: {
          self: {
            href: string;
          };
          html: {
            href: string;
          };
        };
      };
      inline: {};
      pending: boolean;
      type: string;
      links: {
        self: {
          href: string;
        };
        html: {
          href: string;
        };
      };
      pullrequest: {
        type: string;
        id: number;
        title: string;
        links: {
          self: {
            href: string;
          };
          html: {
            href: string;
          };
        };
      };
    };
    approval?: {
      date: string;
      user: {
        display_name: string;
        links: {
          self: {
            href: string;
          };
          avatar: {
            href: string;
          };
          html: {
            href: string;
          };
        };
        type: string;
        uuid: string;
        account_id: string;
        nickname: string;
      };
      pullrequest: {
        type: string;
        id: number;
        title: string;
        links: {
          self: {
            href: string;
          };
          html: {
            href: string;
          };
        };
      };
    };
    changes_requested?: {
      date: string;
      user: {
        display_name: string;
        links: {
          self: {
            href: string;
          };
          avatar: {
            href: string;
          };
          html: {
            href: string;
          };
        };
        type: string;
        uuid: string;
        account_id: string;
        nickname: string;
      };
      pullrequest: {
        type: string;
        id: number;
        title: string;
        links: {
          self: {
            href: string;
          };
          html: {
            href: string;
          };
        };
      };
    };
  }>;
  pagelen: number;
  next: string;
};
