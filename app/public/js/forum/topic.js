new Vue({
    el: "#app",
    delimiters: ['${', '}'],
    data() {
        return {
            username: '',
            placeholder: '',
            forumsUrl: '/api/v1/forum/',
            topicsUrl: '/api/v1/forum/' + $forum_id + '/topic',
            user_list: [],
            topics: [],
            topicSize: 10,
            forum: {},
            topic: {
                _id: '',
                title: '',
                content: '',
                forum_id: '',
                created_by: '',
                created_at: ''
            },
            creatingTopic: false,
            post: {
                fid: '',
                ftid: '',
                content: '',
                created_at: '',
                created_by: ''
            }
        }
    },
    mounted() {
        this.initParams();
        this.getForum();
    },
    methods: {
        createTopic: function () {
            var self = this;
            this.topic.created_at = new Date();
            this.topic.created_by = this.username;
            this.topic.fid = this.forum_id;
            var html = $('#topic_summernote').summernote('code');
            this.topic.content = html;
            this.saveToServer(this.topicsUrl, this.topic, function (_id) {
                var topic = _.clone(self.topic);
                self.topic = {
                    _id: '',
                    title: '',
                    content: '',
                    fid: '',
                    created_by: '',
                    created_at: ''
                };
                topic._id = _id;
                self.topics.push(topic);
                $('#topic_summernote').summernote('reset')
                if (self.topics.length % self.topicSize === 0) {
                    window.location.reload();
                }
            });
        },
        renderData: function (data) {
            this.topics = data;
        },
        saveToServer: function (url, data, callback) {
            $.ajax({
                type: 'post',
                url: url,
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (ret) {
                    if (typeof callback === 'function') {
                        if (ret.code === 0) {
                            callback(ret._id);
                        }
                    } else {
                        window.location.href = '/forums'
                    }
                }
            })
        },
        getForum: function () {
            var self = this;
            $.get(this.forumsUrl + this.forum_id, function (result) {
                if (result.forum) {
                    self.forum = result.forum;
                }
            });
        },
        initParams: function () {
            this.forum_id = $forum_id;
            this.username = $user_name;
            // $('#topic_summernote').summernote({
            //     height: 150,
            //     placeholder: '在此输入内容',
            //     autoHeight: true,

            // });
        }
    },
    filters: {
        formatAvatar: function (avatar) {
            if (avatar) {
                return '/files/' + avatar;
            }
            return ''
        },
        formatTime: function (time) {
            if (time) {
                return moment(time).format('YYYY-MM-DD HH:mm:ss')
            }
            return ''
        }
    }
})