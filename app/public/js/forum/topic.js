new Vue({
    el: "#app",
    delimiters: ['${', '}'],
    data() {
        return {
            username: '',
            placeholder: '',
            forumUrl: '/api/v1/forum/' + $forum_id,
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
            hover: []
        }
    },
    mounted() {
        this.initParams();
        this.getForum();
    },
    methods: {
        mouseover(_id) {
            this.hover[_id] = true;
            this.$forceUpdate();
        },
        mouseout(_id) {
            delete this.hover[_id];
            this.$forceUpdate();
        },
        createTopic() {
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
        renderData(data) {
            this.topics = data;
        },
        saveToServer(url, data, callback) {
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
        getForum() {
            var self = this;
            $.get(this.forumUrl, function (result) {
                if (result.forum) {
                    self.forum = result.forum;
                }
            });
        },
        initParams() {
            this.forum_id = $forum_id;
            this.username = $user_name;
            $('#topic_summernote').summernote({
                lang:'zh-CN',
                height: 150,
                placeholder: '在此输入内容',
                autoHeight: true,

            });
        }
    },
    filters: {
        formatAvatar(avatar) {
            if (avatar) {
                return '/files/' + avatar;
            }
            return ''
        },
        formatTime(time) {
            if (time) {
                return moment(time).format('YYYY-MM-DD HH:mm:ss')
            }
            return ''
        }
    }
})